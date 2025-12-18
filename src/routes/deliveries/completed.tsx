import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useCompletedDeliveries } from "../../hooks/useDeliveries"
import DeliveryTable from "../../components/deliveries/DeliveryTable"
import CartModal from "../../components/deliveries/CartModal"
import type { Delivery } from "../../services/deliveryService"

export const Route = createFileRoute("/deliveries/completed")({
  component: CompletedPage,
})

function CompletedPage() {
  const { data: completedData = [], isLoading } = useCompletedDeliveries()
  const [selectedDelivery, setSelectedDelivery] = useState<{
    id: number
    type: "completed"
  } | null>(null)

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link
          to="/deliveries"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
            Completed Deliveries
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            History of past deliveries
          </p>
        </div>
      </div>

      <DeliveryTable
        title="Past Deliveries"
        data={completedData}
        type="completed"
        loading={isLoading}
        onViewCart={(delivery: Delivery) =>
          setSelectedDelivery({ id: delivery.id, type: "completed" })
        }
      />

      {selectedDelivery && (
        <CartModal
          deliveryId={selectedDelivery.id}
          type={selectedDelivery.type}
          onClose={() => setSelectedDelivery(null)}
        />
      )}
    </div>
  )
}
