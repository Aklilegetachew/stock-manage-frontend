import axios from "axios"

const BASE_URL = "http://localhost:8000/branches"

export const getBranches = async () => {
  const { data } = await axios.get(BASE_URL)
  return data
}

export const getBranch = async (id: number) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`)
  return data
}

export const createBranch = async (branch: {
  name: string
  location: string
}) => {
  const { data } = await axios.post(BASE_URL, branch)
  return data
}

export const updateBranch = async (
  id: number,
  branch: { name: string; location: string }
) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, branch)
  return data
}

export const deleteBranch = async (id: number) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`)
  return data
}
