import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/app/utils/jwt';
import cookie from 'cookie';
import { cookies } from 'next/headers';


const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json({ message: "No tokens found" }, { status: 400});
        }
        // const { refreshToken, userId } = cookie.parse(cookies);
        // if (!refreshToken) {
        //     return NextResponse.json({ message: "No refresh token provided." }, { status: 400 });
        // }
        // console.log("refreshToken is : ", refreshToken);
        // console.log("userId - logout " , userId);
        // // Find the token first
        // const tokenRecord = await prisma.refreshToken.findUnique({
        //     where: { userId: userId }, // Use both to match
        // });
        // console.log(" from delete - " , userId);
        // console.log("tokenRecord - " , tokenRecord);
        // If no token found, return error response
        // if (!tokenRecord) {
        //     return NextResponse.json({ message: "Token not found" }, { status: 401 });
        // }

        // // Delete the found token
        // await prisma.refreshToken.delete({
        //     where: { id: tokenRecord.id }, // Use `id` or any unique field
        // });
        // console.log("deleted token successfully");
        const clearAccessCookie = cookie.serialize('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });
        // const clearRefreshCookie = cookie.serialize('refreshToken', '', {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     expires: new Date(0),
        //     path: '/',
        // });
        const response = NextResponse.json({ message: 'Logged out successfully' });
        response.headers.append('Set-Cookie', clearAccessCookie);
        // response.headers.append('Set-Cookie', clearRefreshCookie); 
        return response;
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error}, { status: 401 });
    }
}
