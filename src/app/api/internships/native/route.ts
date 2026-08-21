import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role != "RECRUITER")
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {company: true}
        });

        if (!user || !user.company)
            return NextResponse.json([], {status: 200});

        const listings = await prisma.nativeInternship.findMany({
            where: {companyId: user.company.id},
            include: {applications: true},
            orderBy: {createdAt: 'desc'}
        });

        return NextResponse.json(listings);
    } catch (error) {
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== "RECRUITER")
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {company: true}
        });

        if (!user || !user.company)
            return NextResponse.json(
                {error: "Please complete your Company Profile first"},
                {status: 403}
            );

        const body = await req.json();
        const {title, location, stipend, duration, description, skills} = body;

        if (!title|| !location || !description)
            return NextResponse.json(
                {error: "Missing required fields."},
                {status: 400}
            );

        const newInternship = await prisma.nativeInternship.create({
            data: {
                companyId: user.company.id,
                title,
                location,
                stipend: stipend || null,
                duration: duration || null,
                description,
                skills: skills || [],
            }
        });

        return NextResponse.json(newInternship, {status: 201});
    }
    catch (error) {
        console.error("Something went wrong while creating the post", error);
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}