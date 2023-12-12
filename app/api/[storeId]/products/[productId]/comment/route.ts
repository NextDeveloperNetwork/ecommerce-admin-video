import { NextResponse } from "next/server"

import prisma from "@/lib/prismadb"
import {auth, useAuth} from "@clerk/nextjs"
import { userInfo } from "os";


export async function POST (
    req: Request,
    { params } : { params:  { storeId:string, productId: string } }
) {

    try {
  
    
        
        const body = await req.json();
        
        const { userId, rate, message } = body;

        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400 });
        }
       
        
        if (!rate) {
            return new NextResponse("A rate is required", { status: 400 });
        }
        
        if (!message) {
            return new NextResponse("A message is required", { status: 400 });
        }

        const userExists = await prisma.user.findFirst({
            where: {
                externalId: userId
            }
        })

        if (!userExists) {
            return new NextResponse("Invalid user", { status: 403 });
        }

        const comments = await prisma.comment.create({

            data: {
                storeId: params.storeId,
                productId: params.productId,
                userId: userId,
                rate: rate,
                message: message
            }
        });
        
        const products = await prisma.product.findFirst({
            where: {
                id: params.productId
            },
            include: {
                comments: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return NextResponse.json(products);
      
    } catch (error) {
        console.log("[PRODUCT_COMMENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function GET (
    req: Request,
    { params } : { params:  { productId: string } }
) {

    try {

        //await prisma.comment.deleteMany({})

        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400 });
        }

        const product = await prisma.product.findFirst({
            where: {
                id: params.productId
            },
            include: {
                comments: {
                    include: {
                        user: true || null
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_COMMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}