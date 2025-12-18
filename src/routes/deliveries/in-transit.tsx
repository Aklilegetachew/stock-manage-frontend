import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { ArrowLeft, Truck } from "lucide-react"
import { useInTransitDeliveries } from "../../hooks/useDeliveries"
import DeliveryTable from "../../components/deliveries/DeliveryTable"
import CartModal from "../../components/deliveries/CartModal"
import type { Delivery } from "../../services/deliveryService"

export const Route = createFileRoute("/deliveries/in-transit")({
  component: InTransitPage,
})

function InTransitPage() {
  const { data: inTransitData = [], isLoading } = useInTransitDeliveries()
  const [selectedDelivery, setSelectedDelivery] = useState<{
    id: number
    type: "in-transit"
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
            <Truck className="h-6 w-6 mr-2 text-blue-600" />
            In Transit Deliveries
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage active deliveries</p>
        </div>
      </div>

      <DeliveryTable
        title="Active Deliveries"
        data={inTransitData}
        type="in-transit"
        loading={isLoading}
        onViewCart={(delivery: Delivery) =>
          setSelectedDelivery({ id: delivery.id, type: "in-transit" })
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
