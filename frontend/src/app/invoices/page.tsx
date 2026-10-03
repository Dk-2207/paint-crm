"use client";

import { useEffect, useState } from "react";

type Customer = { id: number; name: string };
type Product = { id: number; name: string; pricePerUnit: string };
type Invoice = {
  id: number;
  status: string;
  subtotal: string;
  tax: string;
  total: string;
  customer: { name: string };
  items: { quantity: number; priceAtSale: string; product: Product }[];
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const loadInvoices = () => {
    fetch("http://localhost:4000/invoices")
      .then((res) => res.json())
      .then(setInvoices);
  };

  useEffect(() => {
    loadInvoices();
    fetch("http://localhost:4000/customers").then((r) => r.json()).then(setCustomers);
    fetch("http://localhost:4000/products").then((r) => r.json()).then(setProducts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:4000/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: parseInt(customerId),
        items: [{ productId: parseInt(productId), quantity: parseInt(quantity) }],
      }),
    });
    loadInvoices();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 items-center flex-wrap">
        <select className="border p-2" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select Customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border p-2" value={productId} onChange={(e) => setProductId(e.target.value)} required>
          <option value="">Select Product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} (₹{p.pricePerUnit})</option>)}
        </select>
        <input className="border p-2 w-20" type="number" min="1" value={quantity}
          onChange={(e) => setQuantity(e.target.value)} />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Create Invoice</button>
      </form>

      <div className="space-y-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="border rounded p-4">
            <div className="flex justify-between font-semibold">
              <span>{inv.customer.name}</span>
              <span>{inv.status}</span>
            </div>
            <ul className="text-sm text-gray-600 my-2">
              {inv.items.map((item, i) => (
                <li key={i}>{item.product.name} × {item.quantity} @ ₹{item.priceAtSale}</li>
              ))}
            </ul>
            <div className="text-sm">
              Subtotal: ₹{inv.subtotal} | Tax: ₹{inv.tax} | <strong>Total: ₹{inv.total}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}