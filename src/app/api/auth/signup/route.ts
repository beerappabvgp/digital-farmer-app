import { hashPassword } from "@/app/utils/hash";
import { PrismaClient, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
  image: z.string(),
  role: z.string(),
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
  let { name, email, password, image, role } = parsed.data;
  let userRole: Role = Role.FARMER;
  if (Role.FARMER === role) {
    userRole = Role.FARMER;
  } else if(Role.CONSUMER === role) {
    userRole = Role.CONSUMER;
  } else {
    userRole = Role.STORAGE_PROVIDER;
  }
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
      image,
      role: userRole,
    },
  });
  const { password: _, ...userDetails } = user;
  return NextResponse.json({ message: "User created successfully", user: userDetails });
}
