import { useQuery } from "@tanstack/react-query"
import { getStockAlerts } from "../services/stockService"

export function useStockAlerts() {
  return useQuery({
    queryKey: ["stock-alerts"],
    queryFn: getStockAlerts,
    refetchInterval: 10000, // Auto-refetch every 10 seconds
  })
}
