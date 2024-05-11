"use client"

import { formatCurrency, formatNumber } from "@/lib/formatter"
import {
  ArrowDownUp,
  ArrowUpDown,
  CheckCircle2,
  MoreHorizontal,
  XCircleIcon,
} from "lucide-react"

import dynamic from "next/dynamic"
import Link from "next/link"
import { DropdownDeleteProduct, DropdownToggleActive } from "./dropdownActions"
import { DataTable } from "@/components/ui/datatable"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Column, ColumnDef } from "@tanstack/react-table"
import { useState } from "react"

type Product = {
  id: string
  purchasable: boolean
  name: string
  price: number
  orders: number
}

function PriceHeader({ column }: { column: Column<Product, unknown> }) {
  const [toggled, setToggled] = useState<boolean>(false)
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc")
        setToggled((prev) => !prev)
      }}
      className="pl-0 hover:bg-transparent"
    >
      <div className="text-xl">Price</div>
      {toggled ? (
        <ArrowDownUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

const columns: Array<ColumnDef<Product>> = [
  {
    id: "availability",
    header: () => (
      <div className="w-0">
        <span className="sr-only">Available for purchase</span>
      </div>
    ),
    cell: ({ row }) =>
      row.original.purchasable ? (
        <div title="Available">
          <CheckCircle2 className="stroke-green-500" />
          <span className="sr-only">Available for purchase</span>
        </div>
      ) : (
        <div title="Unavailable">
          <XCircleIcon className="stroke-destructive" />
          <span className="sr-only">Unavailable for purchase</span>
        </div>
      ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-xl">Name</div>,
    cell: ({ row }) => <div className="text-lg">{row.original.name}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <PriceHeader column={column} />,
    cell: ({ row }) => (
      <div className="text-lg">{formatCurrency(row.original.price)}</div>
    ),
  },
  {
    accessorKey: "orders",
    header: () => <div className="text-xl">Orders</div>,
    cell: ({ row }) => (
      <div className="text-lg">{formatNumber(row.original.orders)}</div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="w-0">
        <span className="sr-only">Actions</span>
      </div>
    ),
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">More actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a download href={`/admin/products/${row.original.id}/download`}>
              Download
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${row.original.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownToggleActive
            id={row.original.id}
            purchasable={row.original.purchasable}
          />
          <DropdownDeleteProduct
            id={row.original.id}
            disabled={row.original.orders > 0}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function ProductsTable({ data }: { data: Array<Product> }) {
  return <DataTable columns={columns} data={data} />
}

export default dynamic(() => Promise.resolve(ProductsTable), { ssr: false })
