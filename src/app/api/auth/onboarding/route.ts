import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                {error: "Unauthorized action"},
                {status: 401}
            );
        }
        const {dateofBirth, role} = await req.json();

        if (!dateofBirth || !role) {
            return NextResponse.json(
                {error: "Please fill all mandatory fields."},
                {status: 400}
            );
        }

        await prisma.user.update({
            where: {email: session.user.email},
            data: {
                dateofBirth: new Date(dateofBirth),
                role,
            },
        });

        return NextResponse.json({success: true});
    }
    catch (error) {
        return NextResponse.json(
            {error: "Something went wrong while updating your profile."},
            {status: 500}
        );
    }
}