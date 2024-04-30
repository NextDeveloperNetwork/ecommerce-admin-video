import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { subsubId: string } }
) {
  try {
    if (!params.subsubId) {
      return new NextResponse("Subsub id is required", { status: 400 });
    }

    const subsub = await prismadb.subsub.findUnique({
      where: {
        id: params.subsubId
      },
      include: {
        subcategory:true,
        billboard: true,
        icon: true,
      }
    });
  
    return NextResponse.json(subsub);
  } catch (error) {
    console.log('[SUBSUB_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { subsubId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.subsubId) {
      return new NextResponse("Subsub id is required", { status: 400 });
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

    const subsub = await prismadb.subsub.delete({
      where: {
        id: params.subsubId,
      }
    });
  
    return NextResponse.json(subsub);
  } catch (error) {
    console.log('[SUBSUB_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { subsubId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, subcategoryId, billboardId, iconId } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!subcategoryId) {
      return new NextResponse("Subcategory ID is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!iconId) {
      return new NextResponse("Icon ID is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.subsubId) {
      return new NextResponse("Subsub id is required", { status: 400 });
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

    const subsub = await prismadb.subsub.update({
      where: {
        id: params.subsubId,
      },
      data: {
        name,
        subcategoryId,
        billboardId,
        iconId
      }
    });
  
    return NextResponse.json(subsub);
  } catch (error) {
    console.log('[SUBSUB_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
