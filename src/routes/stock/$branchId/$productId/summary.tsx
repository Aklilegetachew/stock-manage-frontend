import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  Calendar,
  Package,
  MapPin,
  Tag,
  Box,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useStockMovements } from "../../../../hooks/useStockMovements"

export const Route = createFileRoute("/stock/$branchId/$productId/summary")({
  component: StockSummaryPage,
})

function StockSummaryPage() {
  const { branchId, productId } = Route.useParams()
  const { data, isLoading, error } = useStockMovements(
    Number(branchId),
    Number(productId)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">Failed to load stock movements</p>
      </div>
    )
  }

  // API returns an array of movements, each containing the stock info
  const movements = data || []
  const stockInfo = movements.length > 0 ? movements[0].deliveryStock : null
  const { quantity, product, branch } = stockInfo || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/stock"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Summary</h1>
          <p className="text-gray-500 text-sm">
            {product?.name} — {branch?.name}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Product
            </div>
            <div className="font-medium text-gray-900">{product?.name}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Type
            </div>
            <div className="font-medium text-gray-900">{product?.type}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center">
              <Box className="w-4 h-4 mr-2" />
              Size
            </div>
            <div className="font-medium text-gray-900">{product?.size}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Branch
            </div>
            <div className="font-medium text-gray-900">{branch?.name}</div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Current Available Quantity
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {quantity} bags
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Remark
                </th>
                 <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.map((movement) => (
                <tr
                  key={movement.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(movement.createdAt).toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === "ADD"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {movement.type === "ADD" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {movement.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        movement.type === "ADD"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {movement.type === "ADD" ? "+" : "-"}
                      {movement.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.remark || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.TransactionNumber || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
