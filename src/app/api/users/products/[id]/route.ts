import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { prisma } from "../../../../../lib/getPrisma";
import { parseCookies } from "@/app/utils/parseCookies";
export async function GET(request: NextRequest,  { params }: { params: { id: string }}) {
  try {
    const cookies = request.headers.get('Set-Cookie');
    const { userId } = cookie.parse(cookies || '');
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
    console.log("user - ", user?.id);
    if (!params.id || user!.role !== "FARMER") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const products = await prisma.product.findMany({
      where: {
        farmerId: params.id,
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
