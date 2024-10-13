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
            return NextResponse.json({ messgae: "No tokens found" }, { status: 400});
        }
        const { refreshToken } = cookie.parse(cookies);
        if (!refreshToken) {
            return NextResponse.json({ message: "No refresh token provided." }, { status: 400 });
        }
        // remove the refresh token from the DB;
        await prisma.refreshToken.delete({
            where: { token: refreshToken },
        });
        const clearAccessCookie = cookie.serialize('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });
        const clearRefreshCookie = cookie.serialize('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });
        const response = NextResponse.json({ message: 'Logged out successfully' });
        response.headers.append('Set-Cookie', clearAccessCookie);
        response.headers.append('Set-Cookie', clearRefreshCookie); 
        return response;
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}
