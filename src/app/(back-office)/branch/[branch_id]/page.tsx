import BranchDashboardContainer from './container';

interface BranchDashboardPageProps {
  params: Promise<{ branch_id: string }>
}

export default async function BranchDashboard({ params }: Readonly<BranchDashboardPageProps>) {
  const { branch_id } = await params
  return <BranchDashboardContainer {...{ branchID: branch_id }} />
}