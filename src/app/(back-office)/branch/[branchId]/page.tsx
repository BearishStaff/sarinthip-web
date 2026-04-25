import { getBranchById } from "@/src/repository/branchRepository";
import BranchDashboardContainer from './container';

interface BranchDashboardPageProps {
  params: Promise<{ branchId: string }>
}

export default async function BranchDashboard({ params }: Readonly<BranchDashboardPageProps>) {
  const { branchId } = await params
  // Fetch specific branch data
  const { data: branch } = await getBranchById(branchId);

  // Fallback title if branch isn't found
  const branchName = branch?.name || "ไม่พบข้อมูลสาขา";
  return <BranchDashboardContainer {...{ branchId: branchId, branchName: branchName }} />
}