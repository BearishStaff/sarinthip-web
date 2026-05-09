"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { useExpense } from "@/src/hooks/useExpense";
import { useCategories } from "@/src/hooks/useCategory";
import { useMonthlyReport } from "@/src/hooks/useMonthlyReport";
import { groupExpensesByCategory, formatNumber } from "@/src/lib/calculations";
import { createPocBillWithItems, type PocExpenseItem } from "@/src/actions/pocActions";
import { getExpensesByCategoryInRange } from "@/src/services/expenseService";
import { thaiMonths } from "@/src/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "entry" | "history" | "receipt";

interface LocalItem {
  id: string;
  itemName: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  categoryId: number | null;
  categoryName: string;
  note: string;
}

// ─── Inline styles matching the prototype's amber palette ────────────────────

const S = {
  page: {
    background: "var(--poc-bg)",
    color: "var(--poc-ink)",
    minHeight: "100vh",
    fontFamily: "'Sarabun', 'Helvetica Neue', sans-serif",
  } as React.CSSProperties,
  topnav: {
    background: "var(--poc-surface)",
    borderBottom: "1.5px solid var(--poc-border)",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    height: 56,
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
    gap: 4,
  },
  main: {
    flex: 1,
    padding: 16,
    maxWidth: 760,
    margin: "0 auto",
    width: "100%",
  },
  card: {
    background: "var(--poc-surface)",
    border: "1.5px solid var(--poc-border)",
    borderRadius: 14,
    boxShadow: "var(--poc-shadow)",
    marginBottom: 14,
    overflow: "hidden",
  } as React.CSSProperties,
  cardHead: {
    padding: "14px 16px",
    borderBottom: "1px solid var(--poc-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--poc-ink)",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  cardBody: { padding: 16 } as React.CSSProperties,
};

// ─── Shared primitive components ──────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...S.card, ...style }}>{children}</div>;
}

function CardHead({ children }: { children: React.ReactNode }) {
  return <div style={S.cardHead}>{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <div style={S.cardTitle}>{children}</div>;
}

function CardBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...S.cardBody, ...style }}>{children}</div>;
}

function Btn({
  children,
  onClick,
  variant = "amber",
  size = "md",
  block = false,
  disabled = false,
  type = "button",
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "amber" | "ghost" | "green" | "red";
  size?: "xs" | "sm" | "md";
  block?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    borderRadius: 9,
    fontWeight: 600,
    fontFamily: "'Sarabun', sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    opacity: disabled ? 0.5 : 1,
    transition: "all .15s",
    justifyContent: block ? "center" : undefined,
    width: block ? "100%" : undefined,
    ...(size === "xs" && { padding: "3px 8px", fontSize: 11, borderRadius: 6 }),
    ...(size === "sm" && { padding: "5px 10px", fontSize: 12 }),
    ...(size === "md" && { padding: "8px 14px", fontSize: 13 }),
    ...(variant === "amber" && { background: "#d97706", color: "#fff" }),
    ...(variant === "ghost" && { background: "transparent", border: "1.5px solid var(--poc-border2)", color: "var(--poc-ink2)" }),
    ...(variant === "green" && { background: "#059669", color: "#fff" }),
    ...(variant === "red" && { background: "#dc2626", color: "#fff" }),
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...style }}>
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--poc-ink2)", marginBottom: 5, letterSpacing: ".3px", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--poc-surface2)",
  border: "1.5px solid var(--poc-border)",
  color: "var(--poc-ink)",
  borderRadius: 9,
  padding: "9px 12px",
  fontFamily: "'Sarabun', sans-serif",
  fontSize: 14,
  outline: "none",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...props.style }} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ ...inputStyle, ...props.style }}>
      {props.children}
    </select>
  );
}

function Badge({ children, color = "amber" }: { children: React.ReactNode; color?: "amber" | "green" | "red" | "blue" }) {
  const colors = {
    amber: { background: "var(--poc-amber-light)", color: "var(--poc-amber)" },
    green: { background: "var(--poc-green-light)", color: "var(--poc-green)" },
    red: { background: "var(--poc-red-light)", color: "var(--poc-red)" },
    blue: { background: "var(--poc-blue-light)", color: "var(--poc-blue)" },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, ...colors[color] }}>
      {children}
    </span>
  );
}

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%",
      transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
      background: "var(--poc-ink)", color: "#fff",
      padding: "10px 20px", borderRadius: 30,
      fontSize: 13, fontWeight: 500,
      opacity: show ? 1 : 0, transition: "all .3s", zIndex: 200,
      whiteSpace: "nowrap" as const,
      pointerEvents: "none",
    }}>
      {message}
    </div>
  );
}

// ─── Entry Tab ────────────────────────────────────────────────────────────────

function EntryTab({ branchId, categories }: { branchId: string; categories: { id: number; name: string }[] }) {
  const today = new Date().toISOString().split("T")[0];

  const [billingDate, setBillingDate] = useState(today);
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("กก.");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [items, setItems] = useState<LocalItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const lineTotal = (parseFloat(qty) || 0) * (parseFloat(pricePerUnit) || 0);
  const grandTotal = items.reduce((s, i) => s + i.totalAmount, 0);

  function showToast(message: string) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }

  function addItem() {
    const q = parseFloat(qty);
    const p = parseFloat(pricePerUnit);
    if (!itemName.trim() || !q || !p) {
      showToast("กรุณากรอกชื่อ จำนวน และราคา");
      return;
    }
    const cat = categories.find(c => c.id === categoryId);
    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemName: itemName.trim(),
        qty: q,
        unit,
        pricePerUnit: p,
        totalAmount: q * p,
        categoryId,
        categoryName: cat?.name || "ยังไม่ระบุ",
        note,
      },
    ]);
    setItemName("");
    setQty("");
    setPricePerUnit("");
    setNote("");
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function saveOrder() {
    if (items.length === 0) return;
    setSaving(true);
    try {
      const result = await createPocBillWithItems(branchId, billingDate, items.map<PocExpenseItem>(i => ({
        itemName: i.itemName,
        qty: i.qty,
        unit: i.unit,
        pricePerUnit: i.pricePerUnit,
        totalAmount: i.totalAmount,
        categoryId: i.categoryId,
        note: i.note,
      })));
      if (result.success) {
        setItems([]);
        showToast("✅ บันทึกรายการเรียบร้อย");
      } else {
        showToast("❌ " + (result.error || "เกิดข้อผิดพลาด"));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Form card */}
      <Card>
        <CardHead>
          <CardTitle>✏️ กรอกรายการ</CardTitle>
          <Input
            type="date"
            value={billingDate}
            onChange={e => setBillingDate(e.target.value)}
            style={{ width: 145, fontSize: 12, padding: "6px 10px" }}
          />
        </CardHead>
        <CardBody>
          {/* Row: name + qty + price */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 110px", gap: 8, marginBottom: 8 }}>
            <Input
              placeholder="ชื่อสินค้า เช่น เนื้อสด"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addItem(); }}
            />
            <Input
              type="number"
              placeholder="จำนวน"
              step="0.1"
              min="0"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
            <div style={{ position: "relative" }}>
              <Input
                type="number"
                placeholder="ราคา/หน่วย"
                step="0.01"
                min="0"
                value={pricePerUnit}
                onChange={e => setPricePerUnit(e.target.value)}
                style={{ paddingRight: 36 }}
              />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--poc-ink3)", pointerEvents: "none" }}>บาท</span>
            </div>
          </div>

          {/* Row: category + unit + line total */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <Select
              value={categoryId ?? ""}
              onChange={e => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
              style={{ flex: 1, fontSize: 13 }}
            >
              <option value="">หมวด...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              style={{ width: 90, fontSize: 13 }}
            >
              {["กก.", "โล", "ถุง", "ฟอง", "ขวด", "แพ็ก", "ชิ้น", "อัน"].map(u => (
                <option key={u}>{u}</option>
              ))}
            </Select>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--poc-green)", fontSize: 16, minWidth: 80, textAlign: "right" }}>
              ฿{formatNumber(lineTotal)}
            </div>
          </div>

          <Input
            placeholder="หมายเหตุ (ไม่บังคับ)"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Btn onClick={addItem} block>+ เพิ่มรายการ</Btn>
        </CardBody>
      </Card>

      {/* Item list card */}
      <Card>
        <CardHead>
          <CardTitle>🛒 รายการวันนี้</CardTitle>
          {items.length > 0 && (
            <Btn variant="ghost" size="sm" onClick={() => setItems([])}>ล้างทั้งหมด</Btn>
          )}
        </CardHead>
        <CardBody style={{ padding: 10 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--poc-ink3)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
              <div style={{ fontSize: 14 }}>ยังไม่มีรายการ</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 100px 28px",
                  gap: 6,
                  alignItems: "center",
                  padding: "8px 10px",
                  background: "var(--poc-surface2)",
                  borderRadius: 8,
                  border: "1px solid var(--poc-border)",
                  fontSize: 13,
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.itemName}</div>
                    <div style={{ fontSize: 11, color: "var(--poc-ink3)" }}>{item.categoryName}{item.note ? ` · ${item.note}` : ""}</div>
                  </div>
                  <div style={{ color: "var(--poc-ink2)", fontSize: 12 }}>{item.qty} {item.unit}</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--poc-green)", fontSize: 13, textAlign: "right" }}>
                    ฿{formatNumber(item.totalAmount)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: "none", border: "none", color: "var(--poc-ink3)", cursor: "pointer", fontSize: 16, padding: 2 }}
                  >×</button>
                </div>
              ))}

              {/* Total bar */}
              <div style={{
                background: "var(--poc-ink)",
                color: "#fff",
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 6,
              }}>
                <div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>ยอดรวมทั้งหมด</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>{items.length} รายการ</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600 }}>
                  ฿{formatNumber(grandTotal)}
                </div>
              </div>
            </div>
          )}
        </CardBody>
        {items.length > 0 && (
          <div style={{ padding: "0 12px 14px", display: "flex", gap: 8 }}>
            <Btn variant="green" block disabled={saving} onClick={saveOrder}>
              {saving ? "กำลังบันทึก..." : "💾 บันทึกรายการ"}
            </Btn>
          </div>
        )}
      </Card>

      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ branchId }: { branchId: string }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading, isError } = useExpense(branchId, month, year);

  const monthInputValue = `${year}-${String(month).padStart(2, "0")}`;

  function onMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [y, m] = e.target.value.split("-").map(Number);
    setYear(y);
    setMonth(m);
  }

  // Group bills by date
  const billsByDate = data?.bills?.reduce<Record<string, typeof data.bills>>((acc, bill) => {
    const date = bill.billing_date?.slice(0, 10) || "unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(bill);
    return acc;
  }, {}) ?? {};

  const sortedDates = Object.keys(billsByDate).sort((a, b) => b.localeCompare(a));

  function formatThaiDate(iso: string) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" });
  }

  const categoryTotals = groupExpensesByCategory(data?.allExpenses ?? []);

  return (
    <div>
      <Card>
        <CardHead>
          <CardTitle>📋 ประวัติการสั่งซื้อ</CardTitle>
          <Input
            type="month"
            value={monthInputValue}
            onChange={onMonthChange}
            style={{ width: 140, fontSize: 12, padding: "6px 10px" }}
          />
        </CardHead>
        <CardBody style={{ padding: 10 }}>
          {isLoading && (
            <div style={{ textAlign: "center", padding: 32, color: "var(--poc-ink3)" }}>กำลังโหลด...</div>
          )}
          {isError && (
            <div style={{ textAlign: "center", padding: 32, color: "var(--poc-red)" }}>เกิดข้อผิดพลาด</div>
          )}
          {!isLoading && sortedDates.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--poc-ink3)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 14 }}>ยังไม่มีประวัติเดือนนี้</div>
            </div>
          )}
          {sortedDates.map(date => (
            <div key={date} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: "var(--poc-ink3)",
                textTransform: "uppercase", letterSpacing: 1,
                marginBottom: 8, display: "flex", alignItems: "center", gap: 8,
              }}>
                {formatThaiDate(date)}
                <div style={{ flex: 1, height: 1, background: "var(--poc-border)" }} />
              </div>
              {billsByDate[date].map(bill => {
                const billTotal = bill.bill_total ?? 0;
                return (
                  <div key={bill.id} style={{
                    background: "var(--poc-surface)",
                    border: "1.5px solid var(--poc-border)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 6,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          {bill.expenses?.length ?? 0} รายการ
                          {bill.is_smart_input && <Badge color="amber">AI</Badge>}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--poc-ink3)", marginTop: 3 }}>
                          {bill.expenses?.slice(0, 3).map((e: any) => e.item_name).join(", ")}
                          {(bill.expenses?.length ?? 0) > 3 ? ` +${(bill.expenses?.length ?? 0) - 3} รายการ` : ""}
                        </div>
                      </div>
                      <div style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--poc-green)" }}>
                        ฿{formatNumber(billTotal)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Category summary */}
      {categoryTotals.length > 0 && (
        <Card>
          <CardHead>
            <CardTitle>📊 สรุปตามหมวดหมู่</CardTitle>
            <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--poc-amber)" }}>
              ฿{formatNumber(data?.grandTotal ?? 0)}
            </div>
          </CardHead>
          <CardBody style={{ padding: 10 }}>
            {categoryTotals.map(cat => (
              <div key={cat.categoryId} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                background: "var(--poc-surface2)",
                borderRadius: 8,
                border: "1px solid var(--poc-border)",
                marginBottom: 5,
                fontSize: 13,
              }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{cat.categoryName}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: "var(--poc-ink3)" }}>{cat.itemCount} รายการ</span>
                </div>
                <div style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--poc-green)" }}>
                  ฿{formatNumber(cat.totalAmount)}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// ─── Receipt Tab ──────────────────────────────────────────────────────────────

interface CategoryPreview {
  id: string;
  name: string;
  expenses: Array<{
    id: string;
    item_name: string;
    qty: number;
    unit: string;
    price_per_unit: number;
    total_amount: number;
    entry_date: string;
  }>;
  total: number;
}

function ReceiptTab({ branchId, branchName }: { branchId: string; branchName: string }) {
  const {
    reportData,
    generateExpensePDF,
    grandTotal,
    month,
    year,
    setMonth,
    setYear,
    isReportLoading,
    isReportError,
  } = useMonthlyReport(branchId);

  const [preview, setPreview] = useState<CategoryPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const yearOptions = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - 10 + i);
  const hasData = !isReportLoading && reportData && reportData.length > 0;

  async function selectCategory(catId: string, catName: string) {
    // Toggle off if already selected
    if (preview?.id === catId) {
      setPreview(null);
      return;
    }
    setLoadingPreview(true);
    setPreview(null);
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
      const { data, error } = await getExpensesByCategoryInRange(branchId, catId, startDate, endDate);
      if (error) throw error;
      const expenses = (data ?? []).map((e: any) => ({
        id: e.id,
        item_name: e.item_name,
        qty: e.qty,
        unit: e.unit,
        price_per_unit: e.price_per_unit,
        total_amount: e.total_amount,
        entry_date: e.entry_date,
      }));
      const total = expenses.reduce((s, e) => s + Number(e.total_amount), 0);
      setPreview({ id: catId, name: catName, expenses, total });
    } finally {
      setLoadingPreview(false);
    }
  }

  function clearOnMonthChange(setter: (v: number) => void, v: number) {
    setter(v);
    setPreview(null);
  }

  async function handleExportPDF() {
    if (!preview || exportingPDF) return;
    setExportingPDF(true);
    try {
      await generateExpensePDF(preview.id);
    } finally {
      setExportingPDF(false);
    }
  }

  // Group expenses by date for the preview
  function groupByDate(expenses: CategoryPreview["expenses"]) {
    const map: Record<string, CategoryPreview["expenses"]> = {};
    for (const e of expenses) {
      const d = e.entry_date?.split("T")[0] ?? "unknown";
      if (!map[d]) map[d] = [];
      map[d].push(e);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }

  function formatThaiDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("th-TH", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  const tdBase: React.CSSProperties = {
    border: "1px solid #999", padding: "5px 8px", fontSize: 12,
  };

  return (
    <div>
      {/* ── Controls + category list ── */}
      <Card>
        <CardHead>
          <CardTitle>🖨️ ออกใบแทนใบเสร็จรับเงิน</CardTitle>
        </CardHead>
        <CardBody>
          {/* Month / Year selectors */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 16, borderBottom: "1px dashed var(--poc-border)", marginBottom: 16 }}>
            <Field label="เดือน">
              <Select
                value={month}
                onChange={e => clearOnMonthChange(setMonth, Number(e.target.value))}
                disabled={isReportLoading}
              >
                {thaiMonths.map((name, i) => (
                  <option key={name} value={i + 1}>{name}</option>
                ))}
              </Select>
            </Field>
            <Field label="ปี (ค.ศ.)">
              <Select
                value={year}
                onChange={e => clearOnMonthChange(setYear, Number(e.target.value))}
                disabled={isReportLoading}
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Grand total */}
          <div style={{ textAlign: "center", paddingBottom: 16, borderBottom: "1px dashed var(--poc-border)", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--poc-ink3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              ยอดใช้จ่ายรวม {thaiMonths[month - 1]} {year}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--poc-ink)", fontFamily: "monospace", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isReportLoading
                ? <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "var(--poc-ink3)" }} />
                : <>฿{grandTotal.toLocaleString()}</>
              }
            </div>
          </div>

          {isReportError && (
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--poc-red)", marginBottom: 12 }}>
              โหลดรายงานไม่สำเร็จ ลองใหม่อีกครั้ง
            </div>
          )}

          {/* Category rows — click to preview */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--poc-ink3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            เลือกหมวดหมู่เพื่อดูรายละเอียด
          </div>

          {!isReportLoading && !hasData && (
            <div style={{ textAlign: "center", padding: "24px 16px", color: "var(--poc-ink3)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 14 }}>ไม่มีรายการเดือนนี้</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reportData?.map((item: any) => {
              const isSelected = preview?.id === item.categoryId;
              const isLoadingThis = loadingPreview && !preview;
              return (
                <button
                  key={item.categoryId}
                  type="button"
                  onClick={() => selectCategory(item.categoryId, item.name)}
                  disabled={isReportLoading || loadingPreview}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: 8, width: "100%",
                    padding: "10px 12px", borderRadius: 10,
                    border: isSelected ? "1.5px solid var(--poc-amber)" : "1.5px solid var(--poc-border)",
                    background: isSelected ? "var(--poc-amber-bg)" : "var(--poc-surface2)",
                    cursor: isReportLoading || loadingPreview ? "not-allowed" : "pointer",
                    textAlign: "left", transition: "all .15s",
                    opacity: loadingPreview && !isSelected ? 0.6 : 1,
                  }}
                >
                  <span style={{ color: isSelected ? "var(--poc-amber)" : "var(--poc-ink2)", fontWeight: 600, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 14 }}>
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 700, color: isSelected ? "var(--poc-amber)" : "var(--poc-ink)", flexShrink: 0, fontFamily: "monospace", fontSize: 13 }}>
                    ฿{item.total.toLocaleString()}
                  </span>
                  {isLoadingThis
                    ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite", color: "var(--poc-ink3)", flexShrink: 0 }} />
                    : isSelected
                      ? <ChevronDown size={16} style={{ color: "var(--poc-amber)", flexShrink: 0 }} />
                      : <ChevronRight size={16} style={{ color: "var(--poc-ink3)", flexShrink: 0 }} />
                  }
                </button>
              );
            })}
          </div>

          {loadingPreview && (
            <div style={{ textAlign: "center", padding: "16px 0", color: "var(--poc-ink3)", fontSize: 13 }}>
              <Loader2 size={18} style={{ display: "inline", animation: "spin 1s linear infinite" }} /> กำลังโหลดรายการ...
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Detailed preview card ── */}
      {preview && (
        <Card>
          <CardHead>
            <CardTitle>📄 {preview.name} — {thaiMonths[month - 1]} {year}</CardTitle>
            <Btn
              variant="amber"
              size="sm"
              disabled={exportingPDF}
              onClick={handleExportPDF}
            >
              {exportingPDF
                ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> กำลังสร้าง...</>
                : <><Download size={13} /> Export PDF</>
              }
            </Btn>
          </CardHead>
          <CardBody style={{ padding: 8 }}>
            <div className="poc-receipt-print-area" style={{
              background: "#fff",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 13,
              color: "#000",
              padding: "16px 20px",
            }}>
              {/* Receipt header */}
              <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{branchName}</div>
                <div style={{ fontSize: 14, fontWeight: 700, margin: "4px 0" }}>ใบแทนใบเสร็จรับเงิน</div>
                <div style={{ fontSize: 12 }}>หมวด: {preview.name} · {thaiMonths[month - 1]} {year}</div>
              </div>

              {/* Detail table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                <thead>
                  <tr>
                    {["รายการ", "จำนวน", "หน่วย", "ราคา/หน่วย", "ยอดรวม"].map(h => (
                      <th key={h} style={{ border: "1px solid #000", padding: "5px 8px", fontWeight: 700, fontSize: 11, background: "#f5f5f5", textAlign: "center" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupByDate(preview.expenses).map(([date, items]) => (
                    <React.Fragment key={date}>
                      {/* Date sub-header */}
                      <tr>
                        <td colSpan={5} style={{ ...tdBase, background: "#f8f8f8", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #ddd" }}>
                          {formatThaiDate(date)}
                        </td>
                      </tr>
                      {items.map(e => (
                        <tr key={e.id}>
                          <td style={tdBase}>{e.item_name}</td>
                          <td style={{ ...tdBase, textAlign: "center" }}>{e.qty}</td>
                          <td style={{ ...tdBase, textAlign: "center" }}>{e.unit}</td>
                          <td style={{ ...tdBase, textAlign: "right", fontFamily: "monospace" }}>{formatNumber(e.price_per_unit)}</td>
                          <td style={{ ...tdBase, textAlign: "right", fontFamily: "monospace" }}>{formatNumber(e.total_amount)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {/* Summary row */}
                  <tr style={{ background: "#f0f0f0" }}>
                    <td colSpan={4} style={{ ...tdBase, fontWeight: 700, textAlign: "right", borderTop: "2px solid #333" }}>
                      ยอดรวมทั้งหมด
                    </td>
                    <td style={{ ...tdBase, fontWeight: 700, textAlign: "right", fontFamily: "monospace", borderTop: "2px solid #333" }}>
                      {formatNumber(preview.total)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 28 }}>
                {["ผู้จัดทำ", "ผู้อนุมัติ"].map(label => (
                  <div key={label} style={{ borderTop: "1px solid #000", paddingTop: 6, textAlign: "center", fontSize: 12 }}>
                    <div style={{ marginBottom: 24 }}>&nbsp;</div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

interface Props {
  branchId: string;
  branchName: string;
}

export default function PocContainer({ branchId, branchName }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("entry");
  const { data: categories = [] } = useCategories();

  const tabs: { id: Tab; label: string }[] = [
    { id: "entry", label: "📝 กรอกรายจ่าย" },
    { id: "history", label: "📋 ประวัติ" },
    { id: "receipt", label: "🖨️ ใบแทนฯ" },
  ];

  return (
    <div className="poc-page" style={S.page}>
      {/* Top nav */}
      <nav style={S.topnav}>
        <button
          onClick={() => router.push(`/branch/${branchId}`)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", color: "var(--poc-ink2)", display: "flex", alignItems: "center" }}
          aria-label="กลับ"
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--poc-amber)",
          marginRight: 12,
          whiteSpace: "nowrap",
        }}>
          🧾 {branchName}
        </div>
        <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "7px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                border: "none",
                fontFamily: "'Sarabun', sans-serif",
                background: activeTab === tab.id ? "var(--poc-amber-light)" : "transparent",
                color: activeTab === tab.id ? "var(--poc-amber)" : "var(--poc-ink3)",
                transition: "all .15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div style={S.main}>
        {activeTab === "entry" && (
          <EntryTab branchId={branchId} categories={categories ?? []} />
        )}
        {activeTab === "history" && (
          <HistoryTab branchId={branchId} />
        )}
        {activeTab === "receipt" && (
          <ReceiptTab branchId={branchId} branchName={branchName} />
        )}
      </div>
    </div>
  );
}
