import axios from "axios"

const BASE_URL = "http://localhost:8000/products"

export const getProducts = async () => {
  const { data } = await axios.get(BASE_URL)
  return data
}

export const getProduct = async (id: number) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`)
  return data
}

export const createProduct = async (product: {
  name: string
  type: string
  size: string
}) => {
  const { data } = await axios.post(BASE_URL, product)
  return data
}

export const updateProduct = async (
  id: number,
  product: { name: string; type: string; size: string }
) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, product)
  return data
}

export const deleteProduct = async (id: number) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`)
  return data
}
