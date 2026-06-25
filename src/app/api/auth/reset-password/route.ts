import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const {token, newPassword} = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                {error: "Missing  required fields."},
                {status: 400}
            );
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                {error: "Invalid or expired reset token"},
                {status: 400}
            );
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {id: user.id},
            data: {
                hashedPassword: newHashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Password has been reset successfully."
        });
    }
    catch (error) {
        return NextResponse.json(
            {error: "Something went wrong while trying to reset the password"},
            {status: 500}
        );
    }
}