import { hashPassword } from "@/app/utils/hash";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

export async function POST(request: Request) {
  // signup route right we need to get all the data from user and create a new user
  const body = await request.json();
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.errors,
      },
      {
        status: 400,
      }
    );
  }
  const { name, email, password } = parsed.data;
  // if validation is successful we will move towards creating the user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  // If there is no user then we need to hash the password and store it right
  const hashedPassword = await hashPassword(password);
  // creating a new user
  const user = await prisma.user.create({
    data: {
      name: name,
      email,
      password: hashedPassword,
    },
  });
  const { password: _, ...userDetails } = user;
  return NextResponse.json({ message: "User created successfully", user: userDetails });
}
