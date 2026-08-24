import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id as string | undefined;

        if (!session?.user?.email)
            return NextResponse.json({error: "Unauthorized"}, {status: 401});

        const user = await prisma.user.findUnique({
            where: {email: session.user.email}
        });

        if (!user)
            return NextResponse.json({error: "User not found"}, {status: 404});

        const savedRecords = await prisma.savedInternship.findMany({
            where: {userId: userId},
            include: {
                internship: true,
                nativeInternship: {include: {company: true}}
            },
            orderBy: {savedAt: 'desc'}
        });

        const savedInternships = savedRecords.map(record => {
            if(record.nativeInternship)
                // Reformatting this so that internshipcard component can work properly with this
                return {
                    id: record.nativeInternship.id,
                    title: record.nativeInternship.title,
                    company: record.nativeInternship.company?.name || "Company",
                    location: record.nativeInternship.location,
                    stipend: record.nativeInternship.stipend,
                    duration: record.nativeInternship.duration,
                    employmentType: record.nativeInternship.employmentType,
                    applyLink: "",
                    sourcePlatform: "MyInternBuddy",
                    postedAt: record.nativeInternship.createdAt,
                    isNative: true
                };
            return record.internship;
        }).filter(Boolean);

        return NextResponse.json(savedInternships);
    }
    catch (error) {
        console.error("Fetch saved internships error:", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}
