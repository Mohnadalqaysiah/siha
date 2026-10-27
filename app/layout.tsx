import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "دليل الأدوية الذكي",
  description: "ابحث عن أي دواء بالاسم التجاري أو المادة الفعالة - أسعار وبدائل وتفاعلات دوائية",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoArabic.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
