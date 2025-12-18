import { X, ShoppingBag, Package } from "lucide-react"
import { useDeliveryCart } from "../../hooks/useDeliveries"

interface CartModalProps {
  deliveryId: number | null
  type: "in-transit" | "completed" | null
  onClose: () => void
}

export default function CartModal({
  deliveryId,
  type,
  onClose,
}: CartModalProps) {
  const {
    data: cartItems,
    isLoading,
    error,
  } = useDeliveryCart(deliveryId, type)

  if (!deliveryId) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
            <div className="sm:flex sm:items-center">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                <ShoppingBag
                  className="h-6 w-6 text-orange-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Delivery Cart Items
                </h3>
                <p className="text-sm text-gray-500">
                  Transaction details for Delivery #{deliveryId}
                </p>
              </div>
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6 bg-gray-50">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-white rounded shadow-sm"
                  ></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-600">
                <p>Failed to load cart items. Please try again.</p>
              </div>
            ) : cartItems?.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">No items found in this cart.</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 -my-5 bg-white rounded-md shadow-sm overflow-hidden"
                >
                  {cartItems?.map((item, index) => (
                    <li
                      key={index}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.productType} • {item.size}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          x{item.quantity}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
