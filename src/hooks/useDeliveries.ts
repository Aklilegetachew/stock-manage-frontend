import { useQuery } from "@tanstack/react-query"
import {
  getInTransitDeliveries,
  getCompletedDeliveries,
  getDeliveryCart,
} from "../services/deliveryService"

export const useInTransitDeliveries = () => {
  return useQuery({
    queryKey: ["deliveries", "in-transit"],
    queryFn: getInTransitDeliveries,
    // Refetch more frequently as these are active deliveries
    refetchInterval: 30000,
  })
}

export const useCompletedDeliveries = () => {
  return useQuery({
    queryKey: ["deliveries", "completed"],
    queryFn: getCompletedDeliveries,
  })
}

export const useDeliveryCart = (
  id: number | null,
  type: "in-transit" | "completed" | null
) => {
  return useQuery({
    queryKey: ["delivery", "cart", id, type],
    queryFn: () => getDeliveryCart(id!, type!),
    enabled: !!id && !!type,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
}
