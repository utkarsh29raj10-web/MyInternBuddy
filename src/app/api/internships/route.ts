// fixed infinite scroll using AI

import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {fetchAndCacheGoogleJobs} from "@/lib/serpapi";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q") || "";
        const location = searchParams.get("location") || "";

        const pageToken = searchParams.get("token") || "";

        if (!query.trim() && !location.trim()) {
            return NextResponse.json({ success: true, source: "cache", data: [] });
        }

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = 10;
        const skip = (page - 1) * limit;
        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const nativeWhere: Prisma.NativeInternshipWhereInput = {
            isActive: true,
            OR: [
                {title: {contains: query, mode: "insensitive"}},
                {description: {contains: query, mode: "insensitive"}},
                {company: {name: {contains: query, mode: "insensitive"}}}
            ],
            ...(location && {location: {contains: location, mode: "insensitive"}}),
        };

        let formattedNative: any[] = [];
        if (page === 1) {
            const nativeJobs = await prisma.nativeInternship.findMany({
                where: nativeWhere,
                orderBy: {createdAt: 'desc'},
                include: {company: true}
            });

            formattedNative = nativeJobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company?.name || "Company",
                location: job.location,
                stipend: job.stipend,
                duration: job.duration,
                applyLink: "",
                sourcePlatform: "MyInternBuddy",
                postedAt: job.createdAt,
                isNative: true
            }));
        }

        const whereCondition: Prisma.InternshipWhereInput = {
            OR: [
                {title: {contains: query, mode: "insensitive"}},
                {description: {contains: query, mode: "insensitive"}},
                {company: {contains: query, mode: "insensitive"}}
            ],
            ...(location && {location: {contains: location, mode: "insensitive"}}),
            fetchedAt: {gte: threeHoursAgo}
        };

        let cachedInternships = await prisma.internship.findMany({
            where: whereCondition,
            orderBy: [{fetchedAt: 'asc'}, {id: 'asc'}],
            skip: skip,
            take: limit
        });

        const totalCachedCount = await prisma.internship.count({ where: whereCondition });

        let newNextPageToken: string | null = null;

        if ((page === 1 && totalCachedCount < 30) || (skip + limit > totalCachedCount)) {
            const fetchResult = await fetchAndCacheGoogleJobs(query, location, pageToken);
            newNextPageToken = fetchResult.nextPageToken;

            cachedInternships = await prisma.internship.findMany({
                where: whereCondition,
                orderBy: [{fetchedAt: 'asc'}, {id: 'asc'}],
                skip: skip,
                take: limit
            });
        }

        const responsePayload: any = {
            success: true,
            source: "cache",
            data: [...formattedNative, ...cachedInternships]
        };

        if (newNextPageToken !== null) {
            responsePayload.nextPageToken = newNextPageToken;
        }

        return NextResponse.json(responsePayload);

    } catch (error) {
        console.error("Error in GET /api/internships:", error);
        return NextResponse.json({success: false, error: "Internal Server Error"}, {status: 500});
    }
}