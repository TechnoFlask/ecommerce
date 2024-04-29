import { Button } from "@/components/ui/button"
import AdminHeader from "../_Components/AdminHeader"
import ProductsTable from "./productsTable"
import Link from "next/link"
import db from "@/lib/prisma"
import { dollarToINR } from "@/lib/formatter"

async function getProductsData() {
  const data = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      orders: {
        select: {
          id: true,
        },
      },
    },
  })
  return data.map(({ id, name, orders, priceInCents }) => ({
    id,
    name,
    price: dollarToINR(priceInCents / 100),
    orders: orders.length,
  }))
}

export default async function AdminProductsPage() {
  const productsData = await getProductsData()
  return (
    <div>
      <div className="flex justify-between">
        <AdminHeader>Products</AdminHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>
      <ProductsTable data={productsData} />
    </div>
  )
}
