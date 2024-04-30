import db from "@/lib/prisma"
import { notFound } from "next/navigation"
import fs from "fs/promises"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  const prod = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  })
  if (prod == null) return notFound()

  const file = await fs.readFile(prod.filePath)
  const [fileSize, extension] = [file.length, prod.filePath.split(".").at(-1)]

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename=${prod.name}.${extension}`,
      "Content-length": fileSize.toString(),
    },
  })
}
