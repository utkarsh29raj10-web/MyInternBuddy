import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const {email} = await req.json();
        if (!email) {
            return NextResponse.json(
                {error: "Email is required"},
                {status: 400}
            );
        }

        const user = await prisma.user.findUnique({where: {email}});

        if (!user)
            return NextResponse.json({success: true, message: "A reset link has been sent to your email."});

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const tokenExpiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: {email},
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: tokenExpiry,
            },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;

        console.log(`\nMOCK EMAIL`);
        console.log(`To: ${email}`);
        console.log(`Subject: Reset your MyInternBuddy Password`);
        console.log(`Body: Click here to securely reset your password: ${resetUrl}`);
        console.log(`\n${resetUrl}\n=====\n`);

        return NextResponse.json({
            success: true,
            message: "Reset link has been sent to your email.",
        });
    }
    catch (error) {
        return NextResponse.json(
            {error: "Failed to process request"},
            {status: 500},
        );
    }
}