import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatNumber } from "@/lib/formatter"
import { CheckCircle2, MoreVertical, XCircleIcon } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { DropdownDeleteProduct, DropdownToggleActive } from "./dropdownActions"

type Product = {
  id: string
  purchasable: boolean
  name: string
  price: number
  orders: number
}

function ProductsTable({ data }: { data: Array<Product> }) {
  return (
    <div className="container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Available for Purchase</span>
            </TableHead>
            <TableHead className="text-lg">Name</TableHead>
            <TableHead className="text-lg">Price</TableHead>
            <TableHead className="text-lg">Orders</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-xl text-center">
                No Results
              </TableCell>
            </TableRow>
          ) : (
            data.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>
                  {prod.purchasable ? (
                    <div title="Available">
                      <CheckCircle2 className="stroke-green-500" />
                      <span className="sr-only">Available</span>
                    </div>
                  ) : (
                    <div title="Unavailable">
                      <XCircleIcon className="stroke-destructive" />
                      <span className="sr-only">Unavailable</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{formatCurrency(prod.price)}</TableCell>
                <TableCell>{formatNumber(prod.orders)}</TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <TableCell>
                      <MoreVertical />
                      <span className="sr-only">More actions</span>
                    </TableCell>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a download href={`/admin/products/${prod.id}/download`}>
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${prod.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownToggleActive
                      id={prod.id}
                      purchasable={prod.purchasable}
                    />
                    <DropdownMenuSeparator />
                    <DropdownDeleteProduct
                      id={prod.id}
                      disabled={prod.orders > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ProductsTable), { ssr: false })
