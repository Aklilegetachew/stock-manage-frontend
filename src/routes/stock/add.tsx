import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  ArrowLeft,
  Save,
  MapPin,
  Package,
  Layers,
  AlertCircle,
} from "lucide-react"
import { useAddStock } from "../../hooks/useStock"
import { useBranches } from "../../hooks/useBranches"
import { useProducts } from "../../hooks/useProducts"

export const Route = createFileRoute("/stock/add")({
  component: AddStockPage,
})

function AddStockPage() {
  const [branchId, setBranchId] = useState("")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [errors, setErrors] = useState<{
    branchId?: string
    productId?: string
    quantity?: string
  }>({})
  const navigate = useNavigate()

  const addStock = useAddStock()
  const { data: branches = [] } = useBranches()
  const { data: products = [] } = useProducts()

  const validate = () => {
    const newErrors: {
      branchId?: string
      productId?: string
      quantity?: string
    } = {}
    if (!branchId) newErrors.branchId = "Branch is required"
    if (!productId) newErrors.productId = "Product is required"
    if (!quantity || Number(quantity) <= 0)
      newErrors.quantity = "Valid quantity is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await addStock.mutateAsync({
        branchId: Number(branchId),
        productId: Number(productId),
        quantity: Number(quantity),
      })
      navigate({ to: "/stock" })
    } catch (error) {
      console.error("Failed to add stock:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/stock"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add Stock</h1>
          <p className="text-sm text-gray-500">Add inventory to a branch</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Branch Selection */}
            <div className="space-y-2">
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700"
              >
                Select Branch <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="branch"
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    errors.branchId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm focus:outline-none sm:text-sm transition-colors appearance-none bg-white`}
                  value={branchId}
                  onChange={(e) => {
                    setBranchId(e.target.value)
                    if (errors.branchId)
                      setErrors({ ...errors, branchId: undefined })
                  }}
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.branchId && (
                <p className="text-sm text-red-600 mt-1">{errors.branchId}</p>
              )}
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700"
              >
                Select Product <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="product"
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    errors.productId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm focus:outline-none sm:text-sm transition-colors appearance-none bg-white`}
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value)
                    if (errors.productId)
                      setErrors({ ...errors, productId: undefined })
                  }}
                >
                  <option value="">Select a product</option>
                  {products.map((product: any) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.type} - {product.size})
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.productId && (
                <p className="text-sm text-red-600 mt-1">{errors.productId}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.quantity
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="e.g. 100"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    if (errors.quantity)
                      setErrors({ ...errors, quantity: undefined })
                  }}
                />
                {errors.quantity && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end space-x-4 border-t border-gray-100 mt-6">
              <Link
                to="/stock"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={addStock.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {addStock.isPending ? "Adding..." : "Add Stock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
