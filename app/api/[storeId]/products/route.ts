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

    const { name, description, quantity, price,  categoryId, subcategoryId, colorId, sizeId, images, isFeatured, isArchived, isOffered, isUndercost } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!quantity) {
      return new NextResponse("Quantity is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!subcategoryId) {
      return new NextResponse("Subcategory id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        quantity,
        price,
        isFeatured,
        isArchived,
        isOffered,
        isUndercost,
        categoryId,
        subcategoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const name= searchParams.get(' name') || undefined;
    const description= searchParams.get('description') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const subcategoryId = searchParams.get('subcategoryId') || undefined;
    const searchValue = decodeURIComponent(searchParams.get('searchValue') || "") || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');
    const isOffered = searchParams.get('isOffered');
    const isUndercost = searchParams.get('isUndercost');
     console.log("Search:"+searchValue)
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        name: {
            contains: searchValue
          },
        description,
        subcategoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined ,// we dont pass false so it ignores this clause
        isOffered: isOffered ? true : undefined ,// we dont pass false so it ignores this clause
        isUndercost: isUndercost ? true : undefined ,// we dont pass false so it ignores this clause
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
        color: true,
        size: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
