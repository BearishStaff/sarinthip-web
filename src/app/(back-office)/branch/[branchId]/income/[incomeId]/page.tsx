import { getIncomeById } from "@/src/services/incomeService";
import IncomeDetailContainer from "./container";

interface IncomeDetailPageProps {
  params: Promise<{ branchId: string; incomeId: string }>
}

export default async function IncomeDetail({ params }: Readonly<IncomeDetailPageProps>) {
  const { branchId, incomeId } = await params
  
  // Fetch specific income record
  const { data: income, error } = await getIncomeById(incomeId);

  if (error || !income) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบข้อมูลรายรับ</h1>
          <p className="text-gray-600">กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ</p>
        </div>
      </div>
    );
  }
  
  return <IncomeDetailContainer branchId={branchId} income={income} />;
}
