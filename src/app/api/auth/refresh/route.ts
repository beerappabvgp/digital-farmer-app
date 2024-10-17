import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@/app/utils/jwt";
import { Prisma, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json({
                message: "Unauthorized",
            }, {
                status: 401,
            });
        }
        const { refreshToken } = cookie.parse(cookies);
        if (!refreshToken) {
            return NextResponse.json({
                message: "Unauthorized",
            }, {
                status: 401,
            });
        }
        // verify the refresh token 
        const decodedToken = await verifyToken(refreshToken);
        const userId = decodedToken.userId;
        // checking if the refresh token matches with the one in the database 
        const storedRefreshToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });
        console.log(storedRefreshToken);
        if (!storedRefreshToken || storedRefreshToken.userId !== userId) {
            return NextResponse.json({message: "Invalid refresh token or user"}, { status: 401 })
        }
        // checking if the refresh token has expired 
        if (new Date() > storedRefreshToken.expiresAt) {
            await prisma.refreshToken.delete({
                where: {
                    token: refreshToken,
                }
            });
            return NextResponse.json({
                message: "refresh token has expired",
            }, {
                status: 401,
            });
        }
        const payload = {
            userId: storedRefreshToken.userId,
            role: storedRefreshToken.user.role,
        }
        const newAccessToken = await generateAccessToken(payload);
        const newRefreshToken = await generateRefreshToken(payload);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        await prisma.refreshToken.update({
            where: {
                token: refreshToken,
            },
            data: {
                token: newRefreshToken,
                expiresAt: expirationDate,
            }
        });
        // setting new access tokens and refresh tokens in response cookies 
        const accessCookie = cookie.serialize('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 60,
            path: '/',
        });

        const refreshCookie = cookie.serialize('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });
        const response = NextResponse.json({ message: "Tokens refreshed successfully" }, { status: 200 });
        response.headers.append('Set-Cookie', accessCookie);
        response.headers.append('Set-Cookie', refreshCookie);
        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500,
        })
    }
}