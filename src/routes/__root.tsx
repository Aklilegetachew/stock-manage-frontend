import * as React from "react"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import AdminLayout from "../components/AdminLayout"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
      {/* <Outlet /> */}
    </React.Fragment>
  )
}
