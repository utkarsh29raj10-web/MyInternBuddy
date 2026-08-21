import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );

        const user = await prisma.user.findUnique({where: {email: session.user.email}});

        if (!user || (user.role !== "STUDENT" && user.role !== "EXPLORER"))
            return NextResponse.json(
                {error: "Only students can apply for internships"},
                {status: 403}
            );

        if (!user.resumeLink && !user.resumeUrl)
            return NextResponse.json(
                {error: "Please add a resume to your profile before applying"},
                {status: 400}
            );

        const body = await req.json();
        const {internshipId, coverLetter} = body;

        if (!internshipId)
            return NextResponse.json(
                {error: "Missing internship id"},
                {status: 400}
            );

        const application = await prisma.nativeApplication.create({
            data: {
                studentId: user.id,
                internshipId,
                coverLetter: coverLetter || null
            }
        });

        return NextResponse.json({success: true, application});
    }
    catch (error: any) {
        if (error.code === "P2002")
            return NextResponse.json(
                {error: "You have alreadya pplied to this opportunity."},
                {status: 400}
            );
        console.error("Application Error:", error);
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}