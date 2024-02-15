import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns"
import { OrderClient } from "./components/client";
import { OrderItem } from "@prisma/client";


const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    user: item.user.externalId,
    phone: item.phone|| "-",
    address: item.address|| "-",
    tracking: item.tracking || "-",
    status: item.status || "-",
    color: item.orderItems.map((orderItem) => orderItem.color).join(', '),
    size: item.orderItems.map((orderItem) => orderItem.size).join(', '),
    quantity: item.orderItems.map((orderItem) => {
      const metadata = orderItem.metadata as { [key: string]: string };
      return metadata["quantity"]
    }).join(', '),
    products: item.orderItems.map((orderItem) => {
      const metadata = orderItem.metadata as { [key: string]: string };
      return `${orderItem.product.name} (${metadata["quantity"]})`

    }).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      console.log("Orders", item.product.price)
      const metadata = item.metadata as { [key: string]: string };
      return total + Number(item.product.price) * Number(metadata["quantity"])
    }, 0) ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  console.log(formattedOrders)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
