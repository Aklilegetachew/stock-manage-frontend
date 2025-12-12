import { createFileRoute } from "@tanstack/react-router"
import {
  LayoutDashboard,
  MapPin,
  Package,
  Layers,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { format } from "date-fns"

export const Route = createFileRoute("/")({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl shadow-sm border border-red-100">
        <div className="p-3 bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Failed to load dashboard
        </h3>
        <p className="text-gray-500 mt-1 max-w-sm">
          We couldn't fetch the latest statistics. Please check your connection
          and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Reload Page
        </button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your stock management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Branches"
          value={stats.totalBranches}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          icon={Layers}
          color="orange"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          color="red"
          alert={stats.lowStockCount > 0}
        />
      </div>

      {/* Recent Movements Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Movements</h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Last 10 Actions
          </span>
        </div>

        {stats.recentMovements.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <p className="text-gray-500">No recent listing movements found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentMovements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(movement.date), "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <MovementBadge type={movement.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          {movement.product}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {movement.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                        {movement.remark || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-gray-100">
              {stats.recentMovements.map((movement) => (
                <div key={movement.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(movement.date), "MMM d, HH:mm")}
                    </span>
                    <MovementBadge type={movement.type} />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {movement.product}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {movement.branch}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {movement.quantity}
                    </div>
                  </div>
                  {movement.remark && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                      {movement.remark}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Components

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  alert = false,
}: {
  title: string
  value: number
  icon: any
  color: "blue" | "purple" | "orange" | "red"
  alert?: boolean
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  }

  const borderColor = alert
    ? "border-red-300 ring-2 ring-red-50"
    : "border-gray-200"

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border ${borderColor} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p
            className={`text-2xl font-bold mt-1 ${alert ? "text-red-600" : "text-gray-900"}`}
          >
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

function MovementBadge({ type }: { type: "ADD" | "DEDUCT" }) {
  const isAdd = type === "ADD"
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAdd ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isAdd ? (
        <TrendingUp className="w-3 h-3 mr-1" />
      ) : (
        <TrendingDown className="w-3 h-3 mr-1" />
      )}
      {type}
    </span>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-32"
          >
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96">
        <div className="p-6 border-b border-gray-100 flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
