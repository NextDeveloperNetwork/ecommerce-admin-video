import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, subcategoryId, billboardId, iconId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!subcategoryId) {
      return new NextResponse("Subcategory ID  is required", { status: 400 });
    }
    
    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!iconId) {
      return new NextResponse("Icon ID is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const subsub = await prismadb.subsub.create({
      data: {
        name,
        subcategoryId,
        billboardId,
        iconId,
        storeId: params.storeId,
      }
    });
  
    return NextResponse.json(subsub);
  } catch (error) {
    console.log('[SUBSUB_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const subsub = await prismadb.subsub.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(subsub);
  } catch (error) {
    console.log('[SUBSUB_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
