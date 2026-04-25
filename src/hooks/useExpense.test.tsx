import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { deleteExpense, useExpense } from "./useExpense";
import { getBillsWithExpensesByBranchAndDateRange } from "@/src/repository/billRepository";
import { removeExpense } from "@/src/repository/expenseRepository";

vi.mock("@/src/repository/billRepository", () => ({
  getBillsWithExpensesByBranchAndDateRange: vi.fn(),
  getBillDetail: vi.fn(),
}));

vi.mock("@/src/repository/expenseRepository", () => ({
  removeExpense: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useExpense", () => {
  it("transforms bills and calculates totals", async () => {
    vi.mocked(getBillsWithExpensesByBranchAndDateRange).mockResolvedValue({
      data: [
        {
          id: "bill-1",
          billing_date: "2026-04-01",
          is_smart_input: true,
          expenses: [
            { total_amount: 10, categories: { name: "Food" }, item_name: "Eggs" },
            { total_amount: 20, categories: null, item_name: "Bag" },
          ],
        },
      ],
      error: null,
    } as any);

    const { result } = renderHook(() => useExpense("branch-1", 4, 2026), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getBillsWithExpensesByBranchAndDateRange).toHaveBeenCalledTimes(1);
    expect(result.current.data?.grandTotal).toBe(30);
    expect(result.current.data?.bills[0].bill_total).toBe(30);
    expect(result.current.data?.bills[0].expenses[0].category_name).toBe("Food");
    expect(result.current.data?.bills[0].expenses[1].category_name).toBe("Uncategorized");
  });
});

describe("deleteExpense", () => {
  it("returns success when repository deletion succeeds", async () => {
    vi.mocked(removeExpense).mockResolvedValue({ error: null } as any);

    const result = await deleteExpense(22);

    expect(removeExpense).toHaveBeenCalledWith(22);
    expect(result).toEqual({ success: true });
  });
});
