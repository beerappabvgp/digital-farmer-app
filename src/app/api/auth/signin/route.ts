import { verifyPassword } from "@/app/utils/hash";
import { generateAccessToken, generateRefreshToken } from "@/app/utils/jwt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import cookie from 'cookie';

const userSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // get username and password from the request
        const body = await request.json();
        const parsed = userSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
        }

        const { email, password } = parsed.data;

        // get the user from the db
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        // if there is no user with the email, return an error response
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // verify the password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // generate JWT tokens
        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // Check if the refresh token for this user already exists
        const existingToken = await prisma.refreshToken.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (existingToken) {
            // Update the existing refresh token
            await prisma.refreshToken.update({
                where: { userId: user.id },
                data: {
                    token: refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
                },
            });
        } else {
            // Create a new refresh token
            await prisma.refreshToken.create({
                data: {
                    userId: user.id,
                    token: refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
        }

        // return the JWT tokens
        // return NextResponse.json({ accessToken, refreshToken, message: "Login Successful" });
        const accessCookie = cookie.serialize('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60,
            path: '/',
        });
        const refreshCookie = cookie.serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        });
        const response = NextResponse.json({ message: "Login successful" });
        response.headers.append('Set-Cookie', accessCookie);
        response.headers.append('Set-Cookie', refreshCookie);
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error "}, { status: 500 });
    }
}
