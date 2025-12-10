import api from "./api"

export const getProducts = async () => {
  const { data } = await api.get("/products")
  return data
}

export const getProduct = async (id: number) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export const createProduct = async (product: {
  name: string
  type: string
  size: string
}) => {
  const { data } = await api.post("/products", product)
  return data
}

export const updateProduct = async (
  id: number,
  product: { name: string; type: string; size: string }
) => {
  const { data } = await api.put(`/products/${id}`, product)
  return data
}

export const deleteProduct = async (id: number) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}
