import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json({error: "Unauthorized"}, {status: 401});

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {company: true}
        });

        if (!user)
            return NextResponse.json({error: "User not found"}, {status: 404});

        return NextResponse.json(user.company || {});
    }
    catch (error) {
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json({error: "Unauthorized"}, {status: 401});

        const body = await req.json();
        const {name, website, description} = body;

        const user = await prisma.user.findUnique({where: {email: session.user.email}});
        if (!user)
            return NextResponse.json({error: "User not found"}, {status: 404});

        const updatedCompany = await prisma.company.upsert({
            where: {recruiterId: user.id},
            update: {name, website, description},
            create: {recruiterId: user.id, name, website, description}
        });

        return NextResponse.json(updatedCompany);
    }
    catch (error) {
        console.error("Company update error:", error);
        return NextResponse.json({error: "Internal error"}, {status: 500});
    }
}