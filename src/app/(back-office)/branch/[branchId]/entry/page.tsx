import InsertExpenseContainer from './container';

interface InsertExpensePageProps {
  params: Promise<{ branchId: string }>
}

export default async function InsertExpensePage({ params }: Readonly<InsertExpensePageProps>) {
  const { branchId } = await params
  return <InsertExpenseContainer branchId={branchId} />
}