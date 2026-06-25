import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const {email} = await req.json();

        if (!email) {
            return NextResponse.json(
                {error: "Please enter a valid email address"},
                {status: 400}
            );
        }

        const user = await prisma.user.findUnique({where: {email}});

        return NextResponse.json({exists: !!user});
    }
    catch (error) {
        return NextResponse.json(
            {error: "Server Error"},
            {status: 500}
        );
    }
}