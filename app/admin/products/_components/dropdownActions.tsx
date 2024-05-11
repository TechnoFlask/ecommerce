"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import {
  adminDeleteProduct,
  toggleProductPurchasableStatus,
} from "../../_actions/ProductActions"
import { useRouter } from "next/navigation"

export function DropdownToggleActive({
  id,
  purchasable,
}: {
  id: string
  purchasable: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const { refresh } = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductPurchasableStatus(id, !purchasable)
          refresh()
        })
      }}
    >
      {purchasable ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DropdownDeleteProduct({
  id,
  disabled,
}: {
  id: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const { refresh } = useRouter()
  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      variant="destructive"
      className="hover:bg-destructive hover:text-destructive-foreground"
      onClick={() => {
        startTransition(async () => {
          await adminDeleteProduct(id)
          refresh()
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}
