import api from "./api"

export interface StockMovementReportItem {
  id: number
  date: string
  transactionType: "ADD" | "DEDUCT"
  quantity: number
  productName: string
  productType: string
  productSize: string
  branchName: string
  remark: string
  stockAfter: number // Snapshot of stock after movement (if available or calculated)
  transactionNumber: string
}

export interface ReportFilterParams {
  startDate?: string
  endDate?: string
  branchId?: string
  productId?: string
}

export const reportService = {
  getStockMovements: async (params: ReportFilterParams) => {
    const response = await api.get<StockMovementReportItem[]>(
      "/stock/report/movements",
      {
        params,
      }
    )
    return response.data
  },
}
