import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router"
import AdminLayout from "../components/AdminLayout"
import { AuthProvider } from "../context/AuthContext"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const isLogin = location.pathname === "/login"

  return (
    <AuthProvider>
      {isLogin ? (
        <Outlet />
      ) : (
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      )}
    </AuthProvider>
  )
}
