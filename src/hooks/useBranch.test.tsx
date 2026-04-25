import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useBranch } from "./useBranch";
import { listBranches } from "@/src/repository/branchRepository";

vi.mock("@/src/repository/branchRepository", () => ({
  listBranches: vi.fn(),
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

describe("useBranch", () => {
  it("returns branchesData from repository result", async () => {
    vi.mocked(listBranches).mockResolvedValue({
      data: [
        { id: "1", name: "Sarinthip" },
        { id: "2", name: "Por Por" },
      ],
      error: null,
    } as any);

    const { result } = renderHook(() => useBranch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listBranches).toHaveBeenCalledTimes(1);
    expect(result.current.isError).toBe(false);
    expect(result.current.branchesData).toEqual([
      { id: "1", name: "Sarinthip" },
      { id: "2", name: "Por Por" },
    ]);
  });
});
