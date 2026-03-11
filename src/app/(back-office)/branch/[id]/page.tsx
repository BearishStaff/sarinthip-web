'use client';

import BranchDashboardContainer from './container';

interface BranchDashboardPageProps {
  params: Promise<{ id: string }>
}

export default async function BranchDashboard({ params }: Readonly<BranchDashboardPageProps>) {
  const { id } = await params
  return <BranchDashboardContainer {...{ branchID: id }} />
}