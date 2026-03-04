"use client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of restaurant performance and financial summary.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard title="Today's Revenue" value="฿12,450" />
        <StatCard title="Orders Today" value="87" />
        <StatCard title="Pending Orders" value="5" />
        <StatCard title="Monthly Revenue" value="฿284,300" />
      </div>

      {/* Revenue + Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Revenue Summary
          </h2>

          <div className="space-y-3 text-sm md:text-base">
            <Row label="Cash" value="฿6,200" />
            <Row label="PromptPay" value="฿3,850" />
            <Row label="Credit Card" value="฿2,400" />
            <Row label="Food Delivery Apps" value="฿1,950" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-sm md:text-base">
            <li className="border-b pb-2">
              Order #1026 marked as Completed
            </li>
            <li className="border-b pb-2">
              Payment certificate exported (March 2026)
            </li>
            <li className="border-b pb-2">
              New staff account created
            </li>
            <li>
              Menu item "Tom Yum Goong" updated
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({
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

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}