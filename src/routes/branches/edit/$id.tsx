import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Building2, MapPin, AlertCircle } from "lucide-react"
import { useBranch, useUpdateBranch } from "../../../hooks/useBranches"


export const Route = createFileRoute("/branches/edit/$id")({
  component: EditBranchPage,
})

function EditBranchPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: branch, isLoading } = useBranch(Number(id))
  const updateBranch = useUpdateBranch()

  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [errors, setErrors] = useState<{ name?: string; location?: string }>({})

  // Prefill form when data is loaded
  useEffect(() => {
    if (branch) {
      setName(branch.name)
      setLocation(branch.location)
    }
  }, [branch])

  const validate = () => {
    const newErrors: { name?: string; location?: string } = {}
    if (!name.trim()) newErrors.name = "Branch name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await updateBranch.mutateAsync({
        id: Number(id),
        data: { name, location },
      })
      navigate({ to: "/branches" })
    } catch (error) {
      console.error("Failed to update branch:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading branch details...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/branches"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Branch</h1>
          <p className="text-sm text-gray-500">Update branch details</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Branch Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Branch Name <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="e.g. Main Headquarters"
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

            {/* Location */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                  placeholder="e.g. New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Optional: City, State, or full address
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end space-x-4 border-t border-gray-100 mt-6">
              <Link
                to="/branches"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateBranch.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateBranch.isPending ? "Updating..." : "Update Branch"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
