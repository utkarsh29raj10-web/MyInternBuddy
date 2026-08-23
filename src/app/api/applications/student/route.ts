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

        const user = await prisma.user.findUnique({where: {email: session.user.email}});
        if (!user || (user.role !== "STUDENT" && user.role !== "EXPLORER"))
            return NextResponse.json(
                {error: "Only students can view their applications."},
                {status: 403}
            );

        const applications = await prisma.nativeApplication.findMany({
            where: {studentId: user.id},
            include: {internship: {include: {company: true}}},
            orderBy: {appliedAt: 'desc'}
        });

        return NextResponse.json({success: true, applications});
    }
    catch (error) {
        console.error("GET Student Applications Error:", error);
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}