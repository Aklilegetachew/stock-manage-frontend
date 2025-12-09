import { useQuery } from "@tanstack/react-query"
import { getStockMovements } from "../services/stockMovementService"

export function useStockMovements(branchId: number, productId: number) {
  return useQuery({
    queryKey: ["stock-movements", branchId, productId],
    queryFn: () => getStockMovements(branchId, productId),
    enabled: !!branchId && !!productId,
  })
}
