import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paint CRM",
  description: "CRM + Billing for paint business",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav className="flex gap-6 p-4 border-b bg-white">
          <Link href="/" className="font-bold">Dashboard</Link>
          <Link href="/customers">Customers</Link>
          <Link href="/products">Products</Link>
          <Link href="/invoices">Invoices</Link>
          <Link href="/login">Login</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}