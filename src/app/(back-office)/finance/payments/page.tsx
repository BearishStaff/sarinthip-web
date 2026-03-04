"use client";

import { useState } from "react";

type Payment = {
  id: number;
  payer: string;
  amount: string;
  method: string;
  date: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      payer: "Somchai Co., Ltd.",
      amount: "฿12,000",
      method: "Bank Transfer",
      date: "2026-03-01",
    },
    {
      id: 2,
      payer: "Anong Trading",
      amount: "฿8,500",
      method: "PromptPay",
      date: "2026-03-02",
    },
  ]);

  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  const handleAddPayment = () => {
    if (!payer || !amount || !method) return;

    const newPayment: Payment = {
      id: payments.length + 1,
      payer,
      amount: `฿${amount}`,
      method,
      date: new Date().toISOString().split("T")[0],
    };

    setPayments([newPayment, ...payments]);
    setPayer("");
    setAmount("");
    setMethod("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Payment Management
        </h1>
        <p className="text-gray-600 mt-2">
          Record transactions and export certification documents.
        </p>
      </div>

      {/* Record Payment Form */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Record New Payment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Payer Name"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <input
            type="number"
            placeholder="Amount (THB)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Select Payment Method</option>
            <option>Bank Transfer</option>
            <option>PromptPay</option>
            <option>Cash</option>
            <option>Credit Card</option>
          </select>
        </div>

        <button
          onClick={handleAddPayment}
          className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition"
        >
          Save Payment
        </button>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">
            Payment History
          </h2>

          <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
            Export Certification (PDF)
          </button>
        </div>

        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="py-3 text-left">ID</th>
              <th className="py-3 text-left">Payer</th>
              <th className="py-3 text-left">Amount</th>
              <th className="py-3 text-left">Method</th>
              <th className="py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="py-3 font-medium">
                  #{payment.id}
                </td>
                <td className="py-3">{payment.payer}</td>
                <td className="py-3 font-semibold">
                  {payment.amount}
                </td>
                <td className="py-3">{payment.method}</td>
                <td className="py-3">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}