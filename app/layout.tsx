import type { Metadata } from "next"
import "@/styles/globals.css"
import { Lato as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "A simple project",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
