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
        const employmentType = searchParams.get("employmentType") || "Internship";

        if (!query.trim() && !location.trim()) {
            return NextResponse.json({ success: true, source: "cache", data: [] });
        }

        if (pageToken) {
            const fetchResult = await fetchAndCacheGoogleJobs(query, location, employmentType, pageToken);
            return NextResponse.json({
                success: true,
                source: "live_pagination",
                data: fetchResult.jobs,
                nextPageToken: fetchResult.nextPageToken
            });
        }

        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const nativeWhere: Prisma.NativeInternshipWhereInput = {
            isActive: true,
            employmentType: employmentType,
            OR: [
                {title: {contains: query, mode: "insensitive"}},
                {description: {contains: query, mode: "insensitive"}},
                {company: {name: {contains: query, mode: "insensitive"}}}
            ],
            ...(location && {location: {contains: location, mode: "insensitive"}}),
        };

        const nativeJobs = await prisma.nativeInternship.findMany({
            where: nativeWhere,
            orderBy: {createdAt: 'desc'},
            include: {company: true}
        });

        const formattedNative = nativeJobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company?.name || "Company",
            location: job.location,
            stipend: job.stipend,
            duration: job.duration,
            employmentType: job.employmentType,
            applyLink: "",
            sourcePlatform: "MyInternBuddy",
            postedAt: job.createdAt,
            isNative: true
        }));

        const fetchResult = await fetchAndCacheGoogleJobs(query, location, employmentType);

        let finalSerpJobs = fetchResult.jobs;

        if (finalSerpJobs.length === 0) {
            const whereCondition: Prisma.InternshipWhereInput = {
                employmentType: employmentType,
                OR: [
                    {title: {contains: query, mode: "insensitive"}},
                    {description: {contains: query, mode: "insensitive"}},
                    {company: {contains: query, mode: "insensitive"}}
                ],
                ...(location && {location: {contains: location, mode: "insensitive"}}),
                fetchedAt: {gte: threeHoursAgo}
            };

            finalSerpJobs = await prisma.internship.findMany({
                where: whereCondition,
                orderBy: [{fetchedAt: 'desc'}],
                take: 15
            });
        }

        return NextResponse.json({
            success: true,
            source: "cache_and_live",
            data: [...formattedNative, ...finalSerpJobs],
            nextPageToken: fetchResult.nextPageToken || null
        });
    } catch (error) {
        console.error("Error in GET /api/internships:", error);
        return NextResponse.json({success: false, error: "Internal Server Error"}, {status: 500});
    }
}