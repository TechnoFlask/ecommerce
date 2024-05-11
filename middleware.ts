import { NextRequest, NextResponse } from "next/server"
import { verifyHashedPassword } from "./lib/auth"

export async function middleware(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic",
      },
    })
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader == null) return false

  const [username, password] = atob(authHeader.split(" ")[1]).split(":")
  if (password == null) return false

  return (
    username === process.env.ADMIN_USERNAME &&
    (await verifyHashedPassword(password, process.env.ADMIN_PASSWORD!))
  )
}

export const config = {
  matcher: "/admin/:path*",
}
