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

    const { name, description, info, link, quantity, price,  categoryId, subcategoryId, subsubId, colors, sizes, images, isFeatured, isArchived, isOffered, isUndercost } = body;

    console.log("======================")
    console.log(body)
    console.log("======================")

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 401 });
    }
    if (!description) {
      return new NextResponse("Description is required", { status: 402 });
    }
    if (!info) {
      return new NextResponse("Info is required", { status: 402 });
    }
    if (!link) {
      return new NextResponse("Paypal Link is required", { status: 402 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 403 });
    }
    if (!quantity) {
      return new NextResponse("Quantity is required", { status: 404 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 405 });
    }
    
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 406 });
    }
    if (!subcategoryId) {
      return new NextResponse("Subcategory id is required", { status: 407 });
    }
    if (!subsubId) {
      return new NextResponse("Subcategory id is required", { status: 407 });
    }
    if (!colors) {
      return new NextResponse("Color id is required", { status: 408 });
    }

    if (!sizes) {
      return new NextResponse("Size id is required", { status: 409});
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 410 });
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
        info,
        link,
        quantity,
        price,
        isFeatured,
        isArchived,
        isOffered,
        isUndercost,
        categoryId,
        subcategoryId,
        subsubId,
        colors: {
          createMany: {
            data: [
              ...colors.map((color: string) => ({colorId: color})),
            ],
          },
        },
        sizes: {
          createMany: {
            data: [
              ...sizes.map((size: string) => ({sizeId: size})),
            ]
          },
        },
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
    const info= searchParams.get('info') || undefined;
    const link= searchParams.get('link') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const subcategoryId = searchParams.get('subcategoryId') || undefined;
    const subsubId = searchParams.get('subsubId') || undefined;
    const searchValue = decodeURIComponent(searchParams.get('searchValue') || "").toUpperCase() || undefined;
    const color = searchParams.get('colors') ;
    const size = searchParams.get('sizes') ;
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
        info,
        link,
        subcategoryId,
      subsubId,
        isFeatured: isFeatured ? true : undefined ,// we dont pass false so it ignores this clause
        isOffered: isOffered ? true : undefined ,// we dont pass false so it ignores this clause
        isUndercost: isUndercost ? true : undefined ,// we dont pass false so it ignores this clause
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
        subsub: true,
        colors: {
          include: {
            color: true
          }
        },
        sizes: {
          include: {
            size: true
          }
        },
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
