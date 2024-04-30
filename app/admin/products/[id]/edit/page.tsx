import AdminHeader from "@/app/admin/_components/AdminHeader"
import AdminProductForm from "../../_components/productForm"
import db from "@/lib/prisma"

export default async function AdminNewProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prod = await db.product.findUnique({ where: { id } })
  return (
    <>
      <AdminHeader>Edit Product</AdminHeader>
      <AdminProductForm prod={prod} />
    </>
  )
}
