"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormState, useFormStatus } from "react-dom"
import { AdminAddProductAction } from "../../_actions/ProductActions"

export default function AdminAddProductForm() {
  const [errors, formAction] = useFormState(AdminAddProductAction, {})
  return (
    <form action={formAction} className="grid grid-cols-1 gap-8">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
      </div>
      {errors.name && <div className="text-destructive">{errors.name}</div>}
      <div>
        <Label htmlFor="price">Price</Label>
        <Input type="number" id="price" name="price" required />
      </div>
      {errors.price && <div className="text-destructive">{errors.price}</div>}
      <div>
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" name="desc" required />
      </div>
      {errors.desc && <div className="text-destructive">{errors.desc}</div>}
      <div>
        <Label htmlFor="file">Price</Label>
        <Input type="file" id="file" name="file" required />
      </div>
      {errors.file && <div className="text-destructive">{errors.file}</div>}
      <div>
        <Label htmlFor="image">Price</Label>
        <Input type="file" id="image" name="image" required />
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
