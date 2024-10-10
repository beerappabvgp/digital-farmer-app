import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, verifyToken } from "./app/utils/jwt";

export async function middleware(request: NextRequest) {
    // we need to validate the token right so first we need to read token from headers
    const token = request.headers.get('Authorization')?.split(' ')[1];
    // Authorization middleware
    if (!token) {
        return NextResponse.redirect(new URL(`/auth/signin`, request.url));
    }
    try {
        const decodedToken = verifyToken(token);
        if (typeof decodedToken !== 'string' && 'userId' in decodedToken) {
            return NextResponse.next();
        } else {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*']
}