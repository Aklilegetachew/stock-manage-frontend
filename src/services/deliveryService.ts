import api from "./api"

export interface CartItem {
  id: number
  productName: string
  productType: string
  size: string
  quantity: number
}

export interface Delivery {
  id: number
  userName: string
  phoneNumber: string
  address: string
  userTelegramId?: string
  longitude?: number | string
  latitude?: number | string
  transactionNumber: string
  totalPayment: number | string
  status: "IN_TRANSIT" | "COMPLETED"
  createdAt: string
  completedAt?: string
  carts?: CartItem[]
}

export const getInTransitDeliveries = async () => {
  const { data } = await api.get<Delivery[]>("/delivery/in-transit")
  return data
}

export const getCompletedDeliveries = async () => {
  const { data } = await api.get<Delivery[]>("/delivery/completed")
  return data
}

export const getDeliveryCart = async (
  id: number,
  type: "in-transit" | "completed"
) => {
  // API returns the full delivery object with a 'carts' property
  const { data } = await api.get<{ carts: CartItem[] }>(
    `/delivery/${type}/${id}/cart`
  )
  return data.carts
}
