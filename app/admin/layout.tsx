import Navbar, { Navlink } from "@/components/Navbar"
import { ReactNode } from "react"

export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar>
        <Navlink href="/admin">Dashboard</Navlink>
        <Navlink href="/admin/products">Products</Navlink>
        <Navlink href="/admin/customers">Customers</Navlink>
        <Navlink href="/admin/orders">Orders</Navlink>
      </Navbar>
      <div className="container my-8">{children}</div>
    </>
  )
}
