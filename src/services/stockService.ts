import axios from "axios"

const BASE_URL = "http://localhost:8000/stock"

export const getStock = async () => {
  const { data } = await axios.get(BASE_URL)
  return data
}

export const addStock = async (data: {
  branchId: number
  productId: number
  quantity: number
}) => {
  const response = await axios.post(`${BASE_URL}/add`, data)
  return response.data
}

export const deductStock = async (data: {
  branchId: number
  productId: number
  quantity: number
  remark?: string
}) => {
  const response = await axios.post(`${BASE_URL}/deduct`, data)
  return response.data
}
