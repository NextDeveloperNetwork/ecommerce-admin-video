"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type SubsubColumn = {
  id: string
  name: string;
  subcategory: string;
  billboardLabel: string;
  iconLabel: string ;
  createdAt: string;
}

export const columns: ColumnDef<SubsubColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "subcategory",
    header: "Subategory",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => row.original.iconLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
