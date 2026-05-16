import { getBranchById } from "@/src/services/branchService";
import ExportReportContainer from "./container"

interface BranchDashboardPageProps {
  params: Promise<{ branchId: string }>
}

export default async function BranchDashboard({ params }: Readonly<BranchDashboardPageProps>) {
  const { branchId } = await params
  const { data: branch } = await getBranchById(branchId);
  const branchName = branch?.name || '';
  return <ExportReportContainer branchId={branchId} branchName={branchName} />
}