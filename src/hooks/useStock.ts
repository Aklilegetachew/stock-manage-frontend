import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getStock,
  addStock as apiAddStock,
  deductStock as apiDeductStock,
} from "../services/stockService"

export function useStock() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: getStock,
  })
}

export function useAddStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiAddStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}

export function useDeductStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeductStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}
