import { getBranchById } from "@/src/services/branchService";
import BranchDashboardContainer from './container';

interface BranchDashboardPageProps {
  params: Promise<{ branchId: string }>
  searchParams: Promise<{ month?: string }>
}

export default async function BranchDashboard({ params, searchParams }: Readonly<BranchDashboardPageProps>) {
  const { branchId } = await params
  const { month } = await searchParams
  
  // Fetch specific branch data
  const { data: branch } = await getBranchById(branchId);

  // Fallback title if branch isn't found
  const branchName = branch?.name || "ไม่พบข้อมูลสาขา";
  
  // Default to current month if not specified
  const selectedMonth = month || new Date().toISOString().slice(0, 7);
  
  return <BranchDashboardContainer {...{ 
    branchId: branchId, 
    branchName: branchName, 
    selectedMonth: selectedMonth 
  }} />
}