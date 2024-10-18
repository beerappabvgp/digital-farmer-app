
import { NextResponse } from "next/server";
import { prisma } from '../../../lib/getPrisma';
import cookie from 'cookie';
export async function POST(request: Request) {
    try {
        const cookies = request.headers.get('Set-Cookie');
        console.log(cookies);
        const { userId, role } = cookie.parse(cookies || '');
        console.log(userId, role);
        if (!userId || role === 'FARMER') {
            return NextResponse.json({
                message: 'Unauthorized',
            }, { status: 401 });
        }
        let { name, description, price, quantity, images } = await request.json();
        price = parseFloat(price);
        quantity = parseInt(quantity);
        const products = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
                farmerId: userId,
                images,
            }
        });
        return NextResponse.json(products, { status: 201 });
    } catch (error) {   
        console.error('Error creating product: ', error);
        return NextResponse.json({ message: 'Internal server error '}, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        // Fetch all products from the database
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                quantity: true,
                images: true,
                farmerId: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc', // Order by latest created
            },
        });

        // Return the products as JSON response
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Error fetching products: ', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}