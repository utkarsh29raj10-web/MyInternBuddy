import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function PUT(req: Request, {params}: {params: {id: string}}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
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
                {error: "Unauthorized"},
                {status: 403}
            );

        const body = await req.json();

        const updated = await prisma.nativeInternship.updateMany({
            where: {
                id: params.id,
                companyId: user.company.id
            },
            data: {
                title: body.title,
                location: body.location,
                stipend: body.stipend || null,
                duration: body.duration || null,
                description: body.description,
                skills: body.skills || []
            }
        });

        return NextResponse.json(
            {success: true, updated}
        );
    }
    catch (error) {
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}

export async function DELTE(req: Request, {params}: {params: {id: string}}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
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
                {error: "Unauthorized"},
                {status: 403}
            );

        await prisma.nativeInternship.deleteMany({
            where: {id: params.id, companyId: user.company.id}
        });

        return NextResponse.json({success: true});
    }
    catch (error) {
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );
    }
}