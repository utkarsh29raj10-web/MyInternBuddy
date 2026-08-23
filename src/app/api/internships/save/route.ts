import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user) {
            return NextResponse.json(
                {success: false, error: "Unauthorized"},
                {status: 401}
            );
        }

        const body = await req.json();
        const {internshipId, isNative} = body;

        if (!internshipId) {
          return NextResponse.json(
              {success: false, error: "Internship ID is required"},
              {status: 400}
          );
        }

        const savedInternship = await prisma.savedInternship.create({
            data: {
                userId: session.user.id,
                nativeInternshipId: isNative ? internshipId : undefined,
                internshipId: isNative ? undefined : internshipId
            }
        });

        return NextResponse.json({success: true, data: savedInternship});
    }
    catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                {success: false, error: "Already Saved"},
                {status: 400}
            );
        }
        console.error("Error saving internship", error);
        return NextResponse.json(
            {success: false, error: "Internal Server Error"},
            {status: 500}
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                {success: false, error: "Unauthorized"},
                {status: 401}
            );
        }

        const searchParams = req.nextUrl.searchParams;
        const internshipId = searchParams.get("internshipId");
        const isNative = searchParams.get("isNative") === "true";

        if (!internshipId) {
            return NextResponse.json(
                {success: false, error: "Internship ID is required."},
                {status: 400}
            );
        }

        await prisma.savedInternship.deleteMany({
            where: {
                userId: session.user.id,
                ...(isNative
                    ? {nativeInternshipId: internshipId}
                    : {internshipId: internshipId}
                )
            }
        });

        return NextResponse.json(
            {success: true, message: "Internship unsaved"}
        );
    }
    catch (error) {
        console.error("Error unsaving internship", error);
        return NextResponse.json(
            {success: true, error: "Internal Server Error"},
            {status: 500}
        );
    }
}