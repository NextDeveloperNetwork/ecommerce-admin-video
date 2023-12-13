import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";



export async function GET(
  req: Request,
  { params }: { params: { externalId: string, storeId: string } }
) {
  try {

    const order = await prismadb.order.findMany({
      where: {
        userId: params.externalId
      }
    });
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


