"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  brand: string;
  type: string;
  size: string;
  pricePerUnit: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", brand: "", type: "", size: "", pricePerUnit: "" });

  const loadProducts = () => {
   fetch("http://localhost:4000/products", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
      .then((res) => res.json())
      .then((data) => {
         setProducts(Array.isArray(data) ? data : []);
         setLoading(false);
      }); 
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:4000/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ ...form, pricePerUnit: parseFloat(form.pricePerUnit) }),
});
    setForm({ name: "", brand: "", type: "", size: "", pricePerUnit: "" });
    loadProducts();
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 flex-wrap">
        <input className="border p-2" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border p-2" placeholder="Brand" value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
        <input className="border p-2" placeholder="Type" value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })} required />
        <input className="border p-2" placeholder="Size" value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })} required />
        <input className="border p-2" placeholder="Price" type="number" step="0.01" value={form.pricePerUnit}
          onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} required />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add</button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Type</th>
            <th className="p-2">Size</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brand}</td>
              <td className="p-2">{p.type}</td>
              <td className="p-2">{p.size}</td>
              <td className="p-2">₹{p.pricePerUnit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}