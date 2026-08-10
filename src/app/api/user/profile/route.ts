import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            select: {name: true, college: true, skills: true, resumeUrl: true, githubUrl: true, linkedinUrl: true, portfolioUrl: true}
        });

        return NextResponse.json(user);
    }
    catch (error) {
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );

        const body = await req.json();

        const {name, college, skills, resumeUrl, githubUrl, linkedinUrl, portfolioUrl} = body;

        const updatedUser = await prisma.user.update({
            where: {email: session.user.email},
            data: {
                ...(name !== undefined && {name}),
                ...(college !== undefined && {college}),
                ...(skills !== undefined && {skills}),
                ...(resumeUrl !== undefined && {resumeUrl}),
                ...(githubUrl !== undefined && {githubUrl}),
                ...(linkedinUrl !== undefined && {linkedinUrl}),
                ...(portfolioUrl !== undefined && {portfolioUrl}),
            }
        });

        return NextResponse.json(
            {success: true, user: updatedUser}
        );
    }
    catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}
