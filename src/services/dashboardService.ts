import api from "./api"

export interface StockMovement {
  id: number
  type: "ADD" | "DEDUCT"
  quantity: number
  remark: string | null
  date: string
  product: string
  branch: string
}

export interface DashboardStats {
  totalBranches: number
  totalProducts: number
  totalStock: number
  lowStockCount: number
  lowStockItems: any[]
  totalMovements: number
  recentMovements: StockMovement[]
}

export const getDashboardStats = async () => {
  const { data } = await api.get<DashboardStats>("/dashboard/stats")
  return data
}
