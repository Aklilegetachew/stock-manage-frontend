import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import AdminLayout from "../components/AdminLayout"

export const Route = createFileRoute("/_layout")({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
})
