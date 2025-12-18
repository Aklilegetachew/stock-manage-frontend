import { useQuery } from "@tanstack/react-query"
import {
  reportService,
  type ReportFilterParams,
} from "../services/reportService"

export function useStockMovementReport(params: ReportFilterParams) {
  return useQuery({
    queryKey: ["report-stock-movements", params],
    queryFn: () => reportService.getStockMovements(params),
    // Only fetch if at least date range is provided or just fetch all?
    // Let's allow fetching by default unless performance issues arise.
  })
}
