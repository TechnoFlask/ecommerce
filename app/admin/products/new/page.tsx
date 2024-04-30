import AdminHeader from "../../_components/AdminHeader"
import AdminProductForm from "../_components/productForm"

export default function AdminNewProductPage() {
  return (
    <>
      <AdminHeader>Add Product</AdminHeader>
      <AdminProductForm prod={null} />
    </>
  )
}
