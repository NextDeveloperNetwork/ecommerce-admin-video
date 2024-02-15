import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const order = await prismadb.order.findMany({
      where: {
        storeId: params.storeId
      },
      include: {
        orderItems:true,
        
      }
    });
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
