import { prisma } from "@/lib/getPrisma";
import { NextResponse } from "next/server";
import cookie from "cookie"
export async function PUT(request: Request, { params }: { params: { id: string }}) {
    try {
        const cookies = request.headers.get('cookie');
        const { userId, role } = cookie.parse(cookies || '');
        console.log(userId, role);
        if (!userId || role !== "FARMER") {
            return NextResponse.json({
                message: 'Unauthorized'
            } , { status: 401 });
        }
        const { name, description, price, quantity, status } = await request.json();
        const updateProduct = await prisma.product.update({
            where: {
                id: params.id,
                farmerId: userId
            },
            data: {
                name,
                description,
                price,
                quantity,
                status,
            }
        });
        return NextResponse.json(updateProduct, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ message: 'Internal Server Error'}, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string }}) {
    try {
        const cookies = request.headers.get('cookie');;
        const { userId, role } = cookie.parse(cookies || '');
        if (!userId || role !== "FARMER") {
            return NextResponse.json({
                message: 'Unauthorized'
            } , { status: 401 });
        }
        const deletedProduct = await prisma.product.delete({
            where: {
                id: params.id,
                farmerId: userId,
            }
        });
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        const cookies = request.headers.get('cookie');
        const { userId, role } = cookie.parse(cookies || '');
        if (!userId || role !== "FARMER") {
            return NextResponse.json({
                message: 'Unauthorized'
            } , { status: 401 });
        }
        const product = await prisma.product.findUnique({
            where: {
                id: params.id,
            }
        });
    return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error('Error fetching the product details.', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
