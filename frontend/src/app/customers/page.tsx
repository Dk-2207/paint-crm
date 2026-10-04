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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "", gstNumber: "" });

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const loadCustomers = () => {
    fetch("http://localhost:4000/customers", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      address: customer.address ?? "",
      gstNumber: customer.gstNumber ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    await fetch(`http://localhost:4000/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    loadCustomers();
  };

  const deleteCustomer = async (id: number) => {
    if (!confirm("Delete this customer?")) return;
    await fetch(`http://localhost:4000/customers/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    loadCustomers();
  };

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
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) =>
            editingId === customer.id ? (
              <tr key={customer.id} className="border-b bg-gray-50">
                <td className="p-2">
                  <input className="border p-1 w-full" value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-full" value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-full" value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-full" value={editForm.gstNumber}
                    onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })} />
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => saveEdit(customer.id)} className="text-green-600 font-medium">Save</button>
                  <button onClick={cancelEdit} className="text-gray-500">Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={customer.id} className="border-b">
                <td className="p-2">{customer.name}</td>
                <td className="p-2">{customer.phone}</td>
                <td className="p-2">{customer.address ?? "-"}</td>
                <td className="p-2">{customer.gstNumber ?? "-"}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => startEdit(customer)} className="text-blue-600 font-medium">Edit</button>
                  <button onClick={() => deleteCustomer(customer.id)} className="text-red-600 font-medium">Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}