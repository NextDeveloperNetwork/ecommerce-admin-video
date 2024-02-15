import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productsBought, userId  } = await req.json();



  if (!productsBought || productsBought.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productsBought.map((p: {id: string, quantity: number}) => p.id)
      }
    }
  });

 

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  const deliveryCost = 300;
  products.forEach((product) => {
    let cartProduct = productsBought.find((p: {id: string, quantity: number, color: string, size: string}) => p.id === product.id)
    console.log("================")
    console.log("Name: " + product.name)
    console.log("Quantity: " + cartProduct.quantity)
    console.log("Price: " + product.price.toNumber())
    let total = product.price.toNumber() * cartProduct.quantity;
    console.log("Total: " + total)
    console.log("================")

    line_items.push({
      quantity: cartProduct.quantity, // Use the quantity from the product object
      price_data: {
          currency: 'ALL',
          product_data: {
              name: product.name,
              metadata: {
                color: cartProduct.color,
                size: cartProduct.size,
                quantity: cartProduct.quantity,
              }
          },
          unit_amount: product.price.toNumber() * 100
      }
  });
});

  
  const totalPrice = line_items.reduce((total, item) => {
    const unitAmount = (item.price_data?.unit_amount ?? 1) * (item?.quantity ?? 1);
    return total + (unitAmount !== undefined ? unitAmount : 0);
  }, 0) / 100;

  const adjustedDeliveryCost = totalPrice > 3999 ? 0 : deliveryCost;
  
  line_items.push({
    quantity: 1,
    price_data: {
      currency: 'ALL',
      product_data: {
        name: 'Delivery Cost',
      },
      unit_amount: adjustedDeliveryCost * 100,
    },
  });


  const order = await prismadb.order.create({
    data: {
      userId,
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productsBought.map((p: { id: string, quantity: number, color: string, size: string }) => ({
          product: {
            connect: {
              id: p.id,
            },
          },
          color: p.color, // Include color property
          size: p.size,   // Include size property
          metadata: {     // You can add additional metadata if needed
            quantity: p.quantity,
          },
        })),
      },
      
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });

};