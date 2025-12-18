import api from "./api"

export interface LoginResponse {
  access_token?: string
  accessToken?: string
  token?: string
  stockAdmin: {
    id: number
    name: string
    email: string
    role: string
  }
}

export const authService = {
  login: async (payload: any) => {
    const response = await api.post<LoginResponse>("/auth/login", payload)
    return response.data
  },
}
