"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormState, useFormStatus } from "react-dom"
import {
  adminAddProductAction,
  adminUpdateProductAction,
} from "../../_actions/ProductActions"
import { Product } from "@prisma/client"
import { centsToINR } from "@/lib/formatter"
import Image from "next/image"

export default function AdminProductForm({ prod }: { prod: Product | null }) {
  const [errors, formAction] = useFormState(
    prod == null
      ? adminAddProductAction
      : adminUpdateProductAction.bind(null, prod.id),
    {}
  )
  const req = <span className="text-red-500 text-lg">*</span>
  return (
    <form action={formAction} className="grid grid-cols-1 gap-8">
      <div className="grid gap-2">
        <Label htmlFor="name">Name{req}</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={prod == null ? "" : prod.name}
          required
        />
      </div>
      {errors.name && <div className="text-destructive">{errors.name}</div>}
      <div className="grid gap-2">
        <Label htmlFor="price">Price{req}</Label>
        <Input
          type="number"
          id="price"
          name="price"
          defaultValue={
            prod == null ? "" : Math.ceil(centsToINR(prod.priceInCents))
          }
          required
        />
      </div>
      {errors.price && <div className="text-destructive">{errors.price}</div>}
      <div className="grid gap-2">
        <Label htmlFor="desc">Description{req}</Label>
        <Textarea
          id="desc"
          name="desc"
          defaultValue={prod == null ? "" : prod.description}
          required
        />
      </div>
      {errors.desc && <div className="text-destructive">{errors.desc}</div>}
      <div className="grid gap-2">
        <Label htmlFor="file">File{prod == null ? req : ""}</Label>
        <Input type="file" id="file" name="file" required={prod == null} />
        {prod != null && (
          <div className="text-muted-foreground">Current: {prod.filePath}</div>
        )}
      </div>
      {errors.file && <div className="text-destructive">{errors.file}</div>}
      <div className="grid gap-2">
        <Label htmlFor="image">Image{prod == null ? req : ""}</Label>
        <Input type="file" id="image" name="image" required={prod == null} />
        {prod != null && (
          <Image
            src={prod.imagePath}
            width={300}
            height={300}
            alt="Current Product Image"
          />
        )}
      </div>
      {errors.image && <div className="text-destructive">{errors.image}</div>}
      <FormButton />
    </form>
  )
}

function FormButton() {
  const { pending } = useFormStatus()
  return (
    <div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving...." : "Save"}
      </Button>
    </div>
  )
}
