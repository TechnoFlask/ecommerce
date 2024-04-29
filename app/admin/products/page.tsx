import { Button } from "@/components/ui/button"
import AdminHeader from "../_components/AdminHeader"
import ProductsTable from "./productsTable"
import Link from "next/link"
import db from "@/lib/prisma"
import { centsToINR } from "@/lib/formatter"

async function getProductsData() {
  const data = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      purchasable: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  })

  return data.map((prod) => ({
    id: prod.id,
    purchasable: prod.purchasable,
    name: prod.name,
    price: Math.ceil(centsToINR(prod.priceInCents)),
    orders: prod._count.orders,
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
