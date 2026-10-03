"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  gstNumber: string | null;
  createdAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Address</th>
            <th className="p-2">GST Number</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.phone}</td>
              <td className="p-2">{customer.address ?? "-"}</td>
              <td className="p-2">{customer.gstNumber ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}