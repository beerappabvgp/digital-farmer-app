import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from '@/app/utils/jwt';
import cookie from "cookie";

export async function middleware(request: NextRequest) {
    try {
        console.log("entered middleware .... ");
        // Parse cookies from the request
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { accessToken } = cookie.parse(cookies);
        if (!accessToken) {
            return NextResponse.json({ error: "Missing access token" }, { status: 401 });
        }

        const decodedToken = await verifyToken(accessToken);
        if (!decodedToken) {
            return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
        }

        // Attach user ID to the headers so that downstream code can use it
        // request.headers.set("userId", decodedToken.userId as string);
        // request.headers.set("role", decodedToken.role as string);
        // return NextResponse.next();
        const response = NextResponse.next();
        response.cookies.set('userId', decodedToken.userId as string, {
            expires: 0,
        });
        console.log(decodedToken.role);
        response.cookies.set('role', decodedToken.role as string, {
            expires: 0,
        });
        return response;
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/auth/logout', '/api/products/:path*', '/api/products/:id*', '/api/users/products/:path*'], // Apply middleware to these routes
};
