import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { prisma } from "../../../../lib/getPrisma";
import { parseCookies } from "@/app/utils/parseCookies";
export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get('Set-Cookie');
    const { userId, role } = parseCookies(cookies!);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });
    if (!userId || user!.role !== "FARMER") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const products = await prisma.product.findMany({
      where: {
        farmerId: userId,
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
