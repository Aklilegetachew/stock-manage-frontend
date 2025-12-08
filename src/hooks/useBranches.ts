import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getBranches,
  getBranch,
  createBranch as apiCreateBranch,
  updateBranch as apiUpdateBranch,
  deleteBranch as apiDeleteBranch,
} from "../services/branchService"

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  })
}

export function useBranch(id: number) {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => getBranch(id),
    enabled: !!id,
  })
}

export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiCreateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: { name: string; location: string }
    }) => apiUpdateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
  })
}
