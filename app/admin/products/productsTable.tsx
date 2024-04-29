import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  id: string
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
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((prod) => (
            <TableRow key={prod.name}>
              <TableCell>{prod.name}</TableCell>
              <TableCell>{prod.orders}</TableCell>
              <TableCell>{prod.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
