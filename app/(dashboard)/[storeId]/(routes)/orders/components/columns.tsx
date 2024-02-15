"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
export type OrderColumn = {
  id: string;
  user: string;
  tracking:string;
  status:string;
  phone: string;
  address: string;
  color: string;
  size: string;
  quantity: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "tracking",
    header: "Tracking.Nr",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];