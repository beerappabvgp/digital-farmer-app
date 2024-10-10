import { generateAccessToken, verifyToken } from "@/app/utils/jwt";
import { PrismaClient } from "@prisma/client";
import { access } from "fs";
import { NextResponse } from "next/server";
import { z } from "zod";
const prisma = new PrismaClient();

const refreshTokenSchema = z.string();

export async function POST(request: Request) {
    let { refreshToken } = await request.json();
    const parsed = refreshTokenSchema.safeParse(refreshToken);
    if (!parsed.success) {
        return NextResponse.json({
            error: parsed.error.errors,
        }, {
            status: 400,
        });
    }
    const tokenInDb = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken,
        }
    });
    if (!tokenInDb) {
        return NextResponse.json({
            error: "Invalid refresh Token",
        }, { status: 401 });
    }
    refreshToken = parsed.data;
    const decodedToken = verifyToken(refreshToken);
    if (typeof decodedToken !== 'string' && 'userId' in decodedToken) {
        const newAccessToken = generateAccessToken(decodedToken.userId)
        return NextResponse.json({ accessToken: newAccessToken });
    } else {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
}