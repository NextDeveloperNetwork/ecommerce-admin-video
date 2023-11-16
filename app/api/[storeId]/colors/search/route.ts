import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
    req: Request,
    { params }: {params: { storeId: string }}
  ) {
    try {
  
        const { searchParams } = new URL(req.url);
        const searchValue = decodeURIComponent(searchParams.get('searchValue') || "") || undefined;
      
        if (!params.storeId) {
            return new NextResponse("StoreId is required", { status: 400 });
        }
  
        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId,
                products: {
                    some: {
                        name: {
                            contains: searchValue
                        }
                    }
                }
            },
        });
    
        return NextResponse.json(colors);
     
    } catch (error) {
        console.log('[SEARCH_COLORS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};