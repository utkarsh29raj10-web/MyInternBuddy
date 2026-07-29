import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {fetchAndCacheGoogleJobs} from "@/lib/serpapi";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q") || "internship";
        const location = searchParams.get("location") || undefined;

        const threeHoursAgo = new Date(Date.now() - 3 * 60 *60 *1000);

        const cachedInternships = await prisma.internship.findMany({
            where: {
                title: {contains: query, mode: "insensitive"},
                ...(location && {location: {contains: location, mode: "insensitive"}}),
                fetchedAt: {gte: threeHoursAgo}
            },
            orderBy: {
                fetchedAt: 'desc'
            },
            take: 20
        });

        if (cachedInternships.length > 0) {
            return NextResponse.json({
                success: true,
                source: "cache",
                data: cachedInternships
            });
        }

        const liveJobs = await fetchAndCacheGoogleJobs(query, location);

        return NextResponse.json({
            success: true,
            source: "serpapi",
            data: liveJobs
        });
    }
    catch (error) {
        console.error("Error in GET /api/internships:", error);
        return NextResponse.json(
            {success: false, error: "Internal Server Error"},
            {status: 500}
        );
    }
}
