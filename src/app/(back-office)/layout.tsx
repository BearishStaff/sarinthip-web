"use client";

import Link from "next/link";
import { useState } from "react";

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-50 flex justify-between items-center px-4 py-3">
        <h1 className="font-bold">Sarinthip Admin</h1>
        <button
          onClick={() => setOpen(!open)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
            fixed md:static
            top-0 left-0
            h-screen md:h-auto
            w-64
            bg-gray-900 text-white
            transform ${open ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            transition-transform duration-300
            z-40
        `}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Sarinthip</h2>
          <p className="text-sm text-gray-400">Back Office</p>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarLink href="/dashboard" label="Dashboard" />
          <SidebarLink href="/finance" label="Finance" />
          <SidebarLink href="/finance/payments" label="Payments" />
        </nav>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0">{children}</main>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
    >
      {label}
    </Link>
  );
}
