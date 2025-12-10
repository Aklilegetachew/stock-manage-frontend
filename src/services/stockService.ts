import api from "./api"

export const getStock = async () => {
  const { data } = await api.get("/stock")
  return data
}

export const addStock = async (data: {
  branchId: number
  productId: number
  quantity: number
}) => {
  const response = await api.post("/stock/add", data)
  return response.data
}

export const deductStock = async (data: {
  branchId: number
  productId: number
  quantity: number
  remark?: string
}) => {
  const response = await api.post("/stock/deduct", data)
  return response.data
}

export const getStockAlerts = async () => {
  const { data } = await api.get("/stock/lowstockalerts")
  return data
}
