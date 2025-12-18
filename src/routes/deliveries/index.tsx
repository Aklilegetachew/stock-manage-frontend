import { createFileRoute, Link } from "@tanstack/react-router"
import { Truck, CheckCircle, Package } from "lucide-react"

export const Route = createFileRoute("/deliveries/")({
  component: DeliveryDashboard,
})

function DeliveryDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Delivery Status</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your delivery operations
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/deliveries/in-transit"
          className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 flex items-center space-x-6 overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-full w-2 bg-blue-500 group-hover:w-full group-hover:bg-blue-50 transition-all duration-300 opacity-10"></div>

          <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-200">
            <Truck className="h-8 w-8" />
          </div>

          <div className="flex-1 relative z-10">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
              In Transit
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              View deliveries currently in progress
            </p>
          </div>
        </Link>

        <Link
          to="/deliveries/completed"
          className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 flex items-center space-x-6 overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-full w-2 bg-green-500 group-hover:w-full group-hover:bg-green-50 transition-all duration-300 opacity-10"></div>

          <div className="flex-shrink-0 h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-200">
            <CheckCircle className="h-8 w-8" />
          </div>

          <div className="flex-1 relative z-10">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
              Completed
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              View history of completed deliveries
            </p>
          </div>
        </Link>
      </div>

      {/* Info Section or Illustration */}
      <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center hidden md:block">
        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
          <Package className="h-6 w-6" />
        </div>
        <p className="text-gray-500 text-sm">
          Select a category above to view delivery details
        </p>
      </div>
    </div>
  )
}
