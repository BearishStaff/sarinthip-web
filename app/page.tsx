"use client";

import { useState } from "react";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        <h1 className="font-bold text-lg">Sarinthip Admin</h1>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-gray-100"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Sarinthip</h1>
          <p className="text-sm text-gray-400">Back Office System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            "Dashboard",
            "Orders",
            "Menu Management",
            "Staff",
            "Reports",
            "Settings",
          ].map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          Logged in as Owner
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Dashboard Overview
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Today's Revenue" value="฿12,450" />
          <StatCard title="Orders Today" value="87" />
          <StatCard title="Pending Orders" value="5" />
          <StatCard title="Monthly Revenue" value="฿284,300" />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>

          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b text-gray-700">
                <th className="py-3 text-left">Order ID</th>
                <th className="py-3 text-left">Customer</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow id="#1024" name="Somchai" amount="฿450" status="Completed" statusColor="text-green-600" />
              <OrderRow id="#1025" name="Anong" amount="฿820" status="Preparing" statusColor="text-yellow-600" />
              <OrderRow id="#1026" name="Narin" amount="฿390" status="Cancelled" statusColor="text-red-600" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <p className="text-gray-600 font-medium">{title}</p>
      <h3 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">
        {value}
      </h3>
    </div>
  );
}

function OrderRow({
  id,
  name,
  amount,
  status,
  statusColor,
}: {
  id: string;
  name: string;
  amount: string;
  status: string;
  statusColor: string;
}) {
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="py-3 font-medium">{id}</td>
      <td className="py-3">{name}</td>
      <td className="py-3 font-semibold">{amount}</td>
      <td className={`py-3 font-semibold ${statusColor}`}>{status}</td>
    </tr>
  );
}