import { createContext, useContext, useState, type ReactNode } from "react"

interface StockAdmin {
  id: number
  email: string
  name: string
  role: string
  [key: string]: any
}

interface AuthContextType {
  stockAdmin: StockAdmin | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (token: string, admin: StockAdmin) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken")
  })

  const [stockAdmin, setStockAdmin] = useState<StockAdmin | null>(() => {
    const stored = localStorage.getItem("stockAdmin")
    return stored ? JSON.parse(stored) : null
  })

  const login = (token: string, admin: StockAdmin) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("stockAdmin", JSON.stringify(admin))
    setAccessToken(token)
    setStockAdmin(admin)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("stockAdmin")
    setAccessToken(null)
    setStockAdmin(null)
  }

  const isAuthenticated = !!accessToken

  return (
    <AuthContext.Provider
      value={{
        stockAdmin,
        accessToken,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
