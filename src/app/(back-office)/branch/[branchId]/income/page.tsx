import InsertIncomeContainer from "./container"

interface InsertIncomePageProps {
  params: Promise<{ branchId: string }>
}

export default async function InsertIncomePage({ params }: Readonly<InsertIncomePageProps>) {
  const { branchId } = await params
  return <InsertIncomeContainer branchId={branchId} />
}
