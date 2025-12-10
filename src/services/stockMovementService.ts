import api from "./api";

export interface StockItem {
  id: number
  quantity: number
  branch: {
    id: number
    name: string
    location: string
    createdAt: string
  }
  product: {
    id: number
    name: string
    type: string
    size: string
  }
}

export interface StockMovement {
  id: number
  quantity: number
  type: "ADD" | "DEDUCT"
  remark: string | null
  createdAt: string
  TransactionNumber: string | null
  deliveryStock: StockItem
}

export const getStockMovements = async (
  branchId: number,
  productId: number
): Promise<StockMovement[]> => {
  const response = await api.get(
    `/stock/${branchId}/${productId}/movements`
  )
  return response.data
}
