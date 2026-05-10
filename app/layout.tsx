import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

const siteUrl = "https://json-view-cn.vercel.app"

export const metadata: Metadata = {
  title: "JSON Tree Viewer — Collapsible, syntax-highlighted JSON component",
  description:
    "A fully-customizable, collapsible, syntax-highlighted JSON tree viewer component for React. Built with shadcn/ui, Base UI, and Tailwind CSS v4. Ready to be copy-pasted into your project.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "json viewer",
    "json tree",
    "react component",
    "shadcn",
    "tailwind css",
    "syntax highlighting",
    "collapsible json",
  ],
  authors: [{ name: "mnove", url: "https://github.com/mnove" }],
  openGraph: {
    title: "JSON Tree Viewer",
    description:
      "A fully-customizable, collapsible, syntax-highlighted JSON tree viewer component. Ready to be copy-pasted into your project.",
    url: siteUrl,
    siteName: "json-view-cn",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Tree Viewer",
    description:
      "A fully-customizable, collapsible, syntax-highlighted JSON tree viewer component. Ready to be copy-pasted into your project.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
