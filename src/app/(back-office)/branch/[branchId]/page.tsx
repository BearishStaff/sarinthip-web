import BranchDashboardContainer from './container';

interface BranchDashboardPageProps {
  params: Promise<{ branchId: string }>
}

export default async function BranchDashboard({ params }: Readonly<BranchDashboardPageProps>) {
  const { branchId } = await params
  return <BranchDashboardContainer {...{ branchId: branchId }} />
}