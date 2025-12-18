import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import {
  Plus,
  Search,
  Package,
  Minus,
  MapPin,
  Tag,
  Box,
  Layers,
  FileText,
  X,
  AlertCircle,
  TriangleAlert,
} from "lucide-react"
import { useDeductStock, useStock } from "../../hooks/useStock"
import { useStockAlerts } from "../../hooks/useStockAlerts"

export const Route = createFileRoute("/stock/")({
  component: StockListPage,
})

function StockListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: stock = [], isLoading, error } = useStock()
  const { data: alerts = [] } = useStockAlerts()
  const deductStock = useDeductStock()

  // Deduct Modal State
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [deductQuantity, setDeductQuantity] = useState("")
  const [deductRemark, setDeductRemark] = useState("")
  const [deductError, setDeductError] = useState("")

  // Filter stock based on search
  const filteredStock = stock.filter(
    (item: any) =>
      item.branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openDeductModal = (item: any) => {
    setSelectedItem(item)
    setDeductQuantity("")
    setDeductRemark("")
    setDeductError("")
    setIsDeductModalOpen(true)
  }

  const closeDeductModal = () => {
    setIsDeductModalOpen(false)
    setSelectedItem(null)
  }

  const handleDeductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return

    const qty = Number(deductQuantity)
    if (!qty || qty <= 0) {
      setDeductError("Please enter a valid quantity.")
      return
    }

    if (qty > selectedItem.quantity) {
      setDeductError("Insufficient stock.")
      return
    }

    try {
      await deductStock.mutateAsync({
        branchId: selectedItem.branch.id,
        productId: selectedItem.product.id,
        quantity: qty,
        remark: deductRemark,
      })
      closeDeductModal()
    } catch (error) {
      console.error("Failed to deduct stock:", error)
      setDeductError("Failed to deduct stock. Please try again.")
    }
  }

  const navigate = useNavigate()

  const handleSummaryClick = (branchId: number, productId: number) => {
    navigate({ to: `/stock/${branchId}/${productId}/summary` })
  }

  if (isLoading) return <div>Loading stock...</div>
  if (error) return <div>Error loading stock</div>

  return (
    <div className="space-y-6">
      {/* Deduct Stock Modal */}
      {isDeductModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Deduct Stock</h3>
              <button
                onClick={closeDeductModal}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeductSubmit}>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedItem.branch.name}
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <Package className="w-4 h-4 mr-2 text-orange-500" />
                    {selectedItem.product.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Current Quantity:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedItem.quantity}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="deduct-qty"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity to Deduct <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="deduct-qty"
                    min="1"
                    max={selectedItem.quantity}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    value={deductQuantity}
                    onChange={(e) => {
                      setDeductQuantity(e.target.value)
                      setDeductError("")
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="deduct-remark"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Remark{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    id="deduct-remark"
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Reason for deduction..."
                    value={deductRemark}
                    onChange={(e) => setDeductRemark(e.target.value)}
                  />
                </div>

                {deductError && (
                  <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                    {deductError}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeDeductModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deductStock.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                >
                  {deductStock.isPending ? "Deducting..." : "Deduct Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage inventory levels across branches
          </p>
        </div>
        <Link
          to="/stock/add"
          className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Stock
        </Link>
      </div>

      {/* Low Stock Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center">
            <TriangleAlert className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-bold text-orange-800">
              Low Stock Alerts
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Branch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alerts.map((alert: any) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert.branch.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      {alert.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by branch or product..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      {filteredStock.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No stock found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding stock to a branch."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                to="/stock/add"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add First Stock
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Branch
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
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
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStock.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <MapPin className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {item.branch.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Package className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {item.product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Tag className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {item.product.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Box className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {item.product.size}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.quantity > 10
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openDeductModal(item)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 transition-colors"
                          >
                            <Minus className="h-3 w-3 mr-1" />
                            Deduct
                          </button>
                          <button
                            onClick={() =>
                              handleSummaryClick(
                                item.branch.id,
                                item.product.id
                              )
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Summary
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredStock.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.branch.name}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Package className="h-4 w-4 mr-1.5 text-orange-500" />
                  {item.product.name}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {item.product.type}
                  </div>
                  <div className="flex items-center">
                    <Box className="h-3 w-3 mr-1" />
                    {item.product.size}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.quantity > 10
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Qty: {item.quantity}
                  </span>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => openDeductModal(item)}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Deduct
                  </button>
                  <button
                    onClick={() =>
                      handleSummaryClick(item.branch.id, item.product.id)
                    }
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Summary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
