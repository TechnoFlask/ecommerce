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

type Product = {
  id: string
  purchasable: boolean
  name: string
  price: number
  orders: number
}

export default function ProductsTable({ data }: { data: Array<Product> }) {
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
            <div>No Results...</div>
          ) : (
            data.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>
                  {prod.purchasable ? (
                    <>
                      <CheckCircle2 />
                      <span className="sr-only">Available</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon />
                      <span className="sr-only">Unavailable</span>
                    </>
                  )}
                </TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{formatCurrency(prod.price)}</TableCell>
                <TableCell>{formatNumber(prod.orders)}</TableCell>
                <TableCell>
                  <MoreVertical />
                  <span className="sr-only">More actions</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
