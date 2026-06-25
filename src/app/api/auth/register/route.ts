import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {email, password, name, dateOfBirth, role} = body;

        if (!email || !password || !name || !dateOfBirth || !role) {
            return NextResponse.json(
                {error: "Please enter all the details."},
                {status: 400}
            );
        }

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json(
                {error: "User already exists."},
                {status: 400}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                dateofBirth: new Date(dateOfBirth),
                role,
                hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        return NextResponse.json(
            {error: "Registration failed"},
            {status: 500}
        );
    }
}