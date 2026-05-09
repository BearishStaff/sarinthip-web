import { getBranchById } from "@/src/services/branchService";
import PocContainer from "./container";

interface Props {
  params: Promise<{ branchId: string }>;
}

export default async function PocPage({ params }: Readonly<Props>) {
  const { branchId } = await params;
  const { data: branch } = await getBranchById(branchId);
  const branchName = branch?.name || "ร้านอาหาร";

  return <PocContainer branchId={branchId} branchName={branchName} />;
}
