import api from "./api"

export interface Branch {
  id?: number
  name: string
  location: string
}

export const getBranches = async () => {
  const { data } = await api.get("/branches")
  return data
}

export const getBranch = async (id: number) => {
  const { data } = await api.get(`/branches/${id}`)
  return data
}

export const createBranch = async (branch: Branch) => {
  const { data } = await api.post<Branch>("/branches", branch)
  return data
}

export const updateBranch = async (id: number, branch: Branch) => {
  const { data } = await api.put<Branch>(`/branches/${id}`, branch)
  return data
}

export const deleteBranch = async (id: number) => {
  const { data } = await api.delete(`/branches/${id}`)
  return data
}
