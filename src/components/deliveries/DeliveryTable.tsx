import { format } from "date-fns"
import { Eye, MapPin, Phone, User, Receipt } from "lucide-react"
import type { Delivery } from "../../services/deliveryService"

interface DeliveryTableProps {
  data: Delivery[]
  title: string
  type: "in-transit" | "completed"
  loading: boolean
  onViewCart: (delivery: Delivery) => void
}

export default function DeliveryTable({
  data,
  title,
  type,
  loading,
  onViewCart,
}: DeliveryTableProps) {
  const isCompleted = type === "completed"

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-50 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className="px-3 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-full text-gray-600">
          {data.length} records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Transaction Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer Info
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No {type.replace("-", " ")} deliveries found.
                </td>
              </tr>
            ) : (
              data.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                        <Receipt className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{delivery.transactionNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {delivery.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <User className="h-3 w-3 mr-1 text-gray-400" />
                      {delivery.userName}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                      {delivery.phoneNumber}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5 truncate max-w-xs">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {delivery.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(delivery.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(delivery.createdAt), "HH:mm")}
                      </span>
                      {isCompleted && delivery.completedAt && (
                        <span className="text-xs text-green-600 mt-1">
                          Completed:{" "}
                          {format(new Date(delivery.completedAt), "MMM d")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                    ETB {Number(delivery.totalPayment).toLocaleString()}
                  </td>

                  {/* Actions always visible now, table scrolls if needed */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => onViewCart(delivery)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <Eye className="h-3 w-3 mr-1.5" />
                      View Cart
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer deleted as it was for mobile actions which are now in table */}
    </div>
  )
}
