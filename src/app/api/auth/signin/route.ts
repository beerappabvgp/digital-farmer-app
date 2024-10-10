import { verifyPassword } from "@/app/utils/hash";
import { generateAccessToken, generateRefreshToken } from "@/app/utils/jwt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
const userSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
    // get username and password from the request
    const body = await request.json();
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors } , { status: 400 });
    }
    const { email, password } = parsed.data;
    // now we need to get the user from the db
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    // if there is no user with the mail return the error response
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    // verify the password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials" } , { status: 401 });
    }
    // return the jwt to the user
    return NextResponse.json({ accessToken, refreshToken, message: "Login Successful" });
}