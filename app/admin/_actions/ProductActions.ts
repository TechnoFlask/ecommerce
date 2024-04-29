"use server"

import { INRtoCents } from "@/lib/formatter"
import db from "@/lib/prisma"
import { z } from "zod"
import fs from "fs/promises"
import { redirect } from "next/navigation"

const fileSchema = z.instanceof(File)
const imageSchema = fileSchema.refine(
  (img) => img.size === 0 || img.type.startsWith("image/"),
  { message: "File should be an image." }
)

const productFormSchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  price: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, {
    message: "File is required",
  }),
  image: imageSchema.refine((img) => img.size > 0, {
    message: "Image is required",
  }),
})

export async function AdminAddProductAction(
  prevState: unknown,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData.entries())
  const { data, error, success } = productFormSchema.safeParse(rawFormData)
  if (!success) return error.flatten().fieldErrors

  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    "public" + imagePath,
    Buffer.from(await data.image.arrayBuffer())
  )

  await db.product.create({
    data: {
      name: data.name,
      description: data.desc,
      priceInCents: INRtoCents(data.price),
      filePath,
      imagePath,
    },
  })

  redirect("/admin/products")
}
