import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
const prisma = new PrismaClient();

const tokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
});

export async function POST (request: Request) {
    try {
        const body = await request.json();
        const parsed = tokenSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid Token"
            }, { status: 400 });
        }
        const { refreshToken } = parsed.data;
        const existingToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!existingToken) {
            // Token doesn't exist, meaning it's invalid or an access token
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 400 });
        }
        await prisma.refreshToken.delete({
            where: {
                token: refreshToken
            }
        });
        return NextResponse.json({ message: 'Sign-out Successful'});
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}