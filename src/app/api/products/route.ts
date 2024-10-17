import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from '../../../lib/getPrisma';
import cookie from 'cookie';
export async function POST(request: Request) {
    try {
        const cookies = request.headers.get('Set-Cookie');
        const { userId, role } = cookie.parse(cookies || '');
        console.log(userId, role);
        if (!userId || role === 'FARMER') {
            return NextResponse.json({
                message: 'Unauthorized',
            }, { status: 401 });
        }
        const { name, description, price, quantity } = await request.json();
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
                farmerId: userId,
            }
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error) {   
        console.error('Error creating product: ', error);
        return NextResponse.json({ message: 'Internal server error '}, { status: 500 });
    }
}

