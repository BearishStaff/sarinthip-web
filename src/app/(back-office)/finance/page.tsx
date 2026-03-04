"use client";

import Link from "next/link";

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Finance Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage payments, financial records, and tax certificates.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <FinanceCard title="Total Revenue (This Month)" value="฿284,300" />
        <FinanceCard title="Total Expenses" value="฿95,200" />
        <FinanceCard title="Net Profit" value="฿189,100" />
        <FinanceCard title="Tax Payable (Est.)" value="฿15,820" />
      </div>

      {/* Navigation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payments */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Payments
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Record payments, manage transaction history, and export
              payment certifications for Revenue Department submission.
            </p>
          </div>

          <Link
            href="/finance/payments"
            className="mt-6 inline-block text-center bg-gray-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-black transition"
          >
            Manage Payments
          </Link>
        </div>

        {/* Tax Reports */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Tax Reports
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Generate monthly VAT reports, withholding tax documents,
              and financial summaries for accounting purposes.
            </p>
          </div>

          <button className="mt-6 bg-gray-200 text-gray-800 px-5 py-3 rounded-xl font-medium hover:bg-gray-300 transition">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <p className="text-gray-600 font-medium">{title}</p>
      <h3 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">
        {value}
      </h3>
    </div>
  );
}