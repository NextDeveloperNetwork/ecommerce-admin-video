import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { iconId: string } }
) {
  try {
    if (!params.iconId) {
      return new NextResponse("Icon id is required", { status: 400 });
    }

    const icon = await prismadb.icon.findUnique({
      where: {
        id: params.iconId
      }
    });
  
    return NextResponse.json(icon);
  } catch (error) {
    console.log('[ICON_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { iconId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.iconId) {
      return new NextResponse("Icon id is required", { status: 400 });
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

    const icon = await prismadb.icon.delete({
      where: {
        id: params.iconId,
      }
    });
  
    return NextResponse.json(icon);
  } catch (error) {
    console.log('[ICON_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { iconId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { label, imageUrl } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.iconId) {
      return new NextResponse("Icon id is required", { status: 400 });
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

    const icon = await prismadb.icon.update({
      where: {
        id: params.iconId,
      },
      data: {
        label,
        imageUrl
      }
    });
  
    return NextResponse.json(icon);
  } catch (error) {
    console.log('[ICON_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

