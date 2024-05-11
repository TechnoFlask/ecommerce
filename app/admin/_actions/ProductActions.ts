"use server"

import { INRtoCents } from "@/lib/formatter"
import db from "@/lib/prisma"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"

const fileSchema = z.instanceof(File)
const imageSchema = fileSchema.refine(
  (img) => img.size === 0 || img.type.startsWith("image/"),
  { message: "File should be an image." }
)

const addProductSchema = z.object({
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

export async function adminAddProductAction(
  prevState: unknown,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData.entries())
  const { data, error, success } = addProductSchema.safeParse(rawFormData)
  if (!success) return error.flatten().fieldErrors

  await Promise.all([
    fs.mkdir("products", { recursive: true }),
    fs.mkdir("public/products", { recursive: true }),
  ])

  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`

  await Promise.all([
    fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer())),
    fs.writeFile(
      "public" + imagePath,
      Buffer.from(await data.image.arrayBuffer())
    ),
    db.product.create({
      data: {
        name: data.name,
        description: data.desc,
        priceInCents: INRtoCents(data.price),
        filePath,
        imagePath,
      },
    }),
  ])

  redirect("/admin/products")
}

const editProductSchema = addProductSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

export async function adminUpdateProductAction(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData.entries())
  const { data, error, success } = editProductSchema.safeParse(rawFormData)
  console.log(error)
  if (!success) return error.formErrors.fieldErrors

  const currProd = await db.product.findUnique({ where: { id } })
  if (currProd == null) return notFound()

  let filePath = currProd.filePath
  let imagePath = currProd.imagePath

  if (data.file != null && data.file.size > 0) {
    await fs.rm(filePath)
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  if (data.image != null && data.image.size > 0) {
    await fs.rm("public" + imagePath)
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(
      "public" + imagePath,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await db.product.update({
    where: { id },
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

export async function toggleProductPurchasableStatus(
  id: string,
  purchasable: boolean
) {
  await db.product.update({
    where: { id },
    data: { purchasable },
  })
}

export async function adminDeleteProduct(id: string) {
  const productPaths = await db.product.findUnique({
    where: { id },
    select: { filePath: true, imagePath: true },
  })

  if (productPaths == null) return notFound()

  const { filePath, imagePath } = productPaths

  const prod = (
    await Promise.all([
      await fs.rm(filePath),
      await fs.rm("public" + imagePath),

      await db.product.delete({ where: { id } }),
    ])
  )[2]

  if (prod == null) return notFound()
}
