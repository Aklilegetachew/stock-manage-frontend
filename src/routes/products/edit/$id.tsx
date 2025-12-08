import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Package, Tag, Box, AlertCircle } from "lucide-react"
import { useProduct, useUpdateProduct } from "../../../hooks/useProducts"

export const Route = createFileRoute("/products/edit/$id")({
  component: EditProductPage,
})

function EditProductPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(Number(id))
  const updateProduct = useUpdateProduct()

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [size, setSize] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    type?: string
    size?: string
  }>({})

  // Prefill form when data is loaded
  useEffect(() => {
    if (product) {
      setName(product.name)
      setType(product.type)
      setSize(product.size)
    }
  }, [product])

  const validate = () => {
    const newErrors: { name?: string; type?: string; size?: string } = {}
    if (!name.trim()) newErrors.name = "Product name is required"
    if (!type.trim()) newErrors.type = "Product type is required"
    if (!size.trim()) newErrors.size = "Product size is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await updateProduct.mutateAsync({
        id: Number(id),
        data: { name, type, size },
      })
      navigate({ to: "/products" })
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading product details...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/products"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-sm text-gray-500">Update product details</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="e.g. Steel Pipe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: undefined })
                  }}
                />
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="type"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.type
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="e.g. Raw Material"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value)
                    if (errors.type) setErrors({ ...errors, type: undefined })
                  }}
                />
                {errors.type && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type}</p>
              )}
            </div>

            {/* Product Size */}
            <div className="space-y-2">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Size <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Box className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="size"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.size
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="e.g. 10m"
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value)
                    if (errors.size) setErrors({ ...errors, size: undefined })
                  }}
                />
                {errors.size && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.size && (
                <p className="text-sm text-red-600 mt-1">{errors.size}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end space-x-4 border-t border-gray-100 mt-6">
              <Link
                to="/products"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateProduct.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProduct.isPending ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
