import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useCategories } from "./useCategory";
import { listCategoryOptions } from "@/src/repository/categoryRepository";

vi.mock("@/src/repository/categoryRepository", () => ({
  listCategoryOptions: vi.fn(),
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

describe("useCategories", () => {
  it("returns category options from repository", async () => {
    vi.mocked(listCategoryOptions).mockResolvedValue({
      data: [
        { id: 1, name: "Food" },
        { id: 2, name: "Transport" },
      ],
      error: null,
    } as any);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(listCategoryOptions).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual([
      { id: 1, name: "Food" },
      { id: 2, name: "Transport" },
    ]);
  });
});
