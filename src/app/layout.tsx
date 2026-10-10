import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalesFlow CRM System — Demo Google Stitch",
  description: "Hệ thống quản lý dữ liệu bán hàng & CRM thông minh thiết kế từ Google Stitch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
