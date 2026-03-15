import { supabase } from '@/src/lib/supabase';
import BranchDashboardContainer from './container';

interface BranchDashboardPageProps {
  params: Promise<{ branchId: string }>
}

export default async function BranchDashboard({ params }: Readonly<BranchDashboardPageProps>) {
  const { branchId } = await params
  // Fetch specific branch data
  const { data: branch, error } = await supabase
    .from('branches')
    .select('name')
    .eq('id', branchId)
    .single();

  // Fallback title if branch isn't found
  const branchName = branch?.name || "ไม่พบข้อมูลสาขา";
  return <BranchDashboardContainer {...{ branchId: branchId, branchName: branchName }} />
}