"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  totalCustomers: number;
  totalSales: number;
  totalInvoices: number;
  recentInvoices: {
    id: number;
    total: string;
    status: string;
    customer: { name: string };
  }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold">{data.totalCustomers}</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">₹{data.totalSales.toFixed(2)}</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold">{data.totalInvoices}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Recent Invoices</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Customer</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.recentInvoices.map((inv) => (
            <tr key={inv.id} className="border-b">
              <td className="p-2">{inv.customer.name}</td>
              <td className="p-2">₹{inv.total}</td>
              <td className="p-2">{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}