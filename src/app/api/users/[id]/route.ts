import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { prisma } from "@/lib/getPrisma";
import { parseCookies } from "@/app/utils/parseCookies";
export async function GET(request: NextRequest,  { params }: { params: { id: string }}) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: params.id,
            }
        });
        return NextResponse.json({
            user,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: error,
        }, { status: 500 });
    }

}