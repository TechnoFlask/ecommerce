import { ReactNode } from "react"

export default function AdminHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl mb-8">{children}</h1>
}
