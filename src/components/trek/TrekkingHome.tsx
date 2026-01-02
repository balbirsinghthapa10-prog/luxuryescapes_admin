"use client"

import React, { act, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Trash2,
  Plus,
  MapIcon,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  SortAsc,
  TreePine,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CustomPagination } from "@/utils/Pagination"
import MainSpinner from "@/utils/MainLoader"
import axios from "axios"
import { toast } from "sonner"

type TrekType = {
  _id: string
  trekName: string
  slug: string
  location: string
  cost: number
  country: string
  // country: string
  tourType: string
  thumbnail: string
  isActivate: boolean
  createdAt: string
}

type ActivationStatus = "active" | "inactive"

const TrekkingHome: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [treks, setTreks] = useState<TrekType[]>([])
  const [search, setSearch] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [activation, setActivation] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("")

  const [totalPages, setTotalPages] = useState(0)

  const sortOptions = [
    // { value: "name_asc", label: "Title (A-Z)" },
    // { value: "name_desc", label: "Title (Z-A)" },
    { value: "createdAtasc", label: "Date (Oldest First)" },
    { value: "createdAtdesc", label: "Date (Newest First)" },
    { value: "asc", label: "Price (Low to High)" },
    { value: "desc", label: "Price (High to Low)" },
  ]

  const handleGetAllTreks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/trek/get/selected?page=${page}&limit=&country=${country}&activation=${activation}&sort=${sortOption}&search=${search}`
      )
      const data = response.data
      if (data.success) {
        setTreks(data.data.treks)
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages)
        }
      }
    } catch (error: any) {
      console.error(error.response.data.message || "Failed to fetch treks")
    } finally {
      setLoading(false)
    }
  }

  // Updated handleVisibility with correct type
  const handleVisibility = async (trekId: string, status: ActivationStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/trek/activate-trek?trekId=${trekId}`,
        {
          activation: status,
        }
      )
      const data = response.data
      if (data.success) {
        handleGetAllTreks()
      }
    } catch (error) {
      console.error("Error updating trek visibility:", error)
      toast.error("Failed to update trek visibility")
    }
  }

  useEffect(() => {
    handleGetAllTreks()
  }, [country, page, activation, sortOption])

  //debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetAllTreks()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const handleDeleteTrek = async (trekId: string, trekName: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${trekName}"?`
    )
    if (!confirmDelete) return

    const response = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/trek/delete/${trekId}`
    )
    toast.promise(response, {
      loading: "Deleting, PLease wait...",
      success: (response) => {
        const data = response.data
        if (data.success) {
          handleGetAllTreks()
          return data.message || "Deleted successfully"
        } else {
          return data.message || "Failed to delete"
        }
      },
      error: "Error deleting tour",
    })

    try {
      setLoading(true)
      await response
    } catch (error: any) {
      console.error(error.response.data.message || "Failed to delete trek")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Trek Manager
          </h2>
          <div className="flex  gap-6">
            <Button
              onClick={() => router.push("/trekkings/create-trek")}
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Trek
            </Button>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          Manage your luxurious packages with multiple options
        </p>
      </div>

      {/* Filters Section */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative">
            <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Country (all)</option>
              <option value="Nepal">Nepal</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Tibet">Tibet</option>
              <option value="Multidestinations">Multi-destination</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={activation}
              onChange={(e) => setActivation(e.target.value)}
            >
              <option value="">Activation (all)</option>
              <option value="active">Activated</option>
              <option value="inactive">Inactivated</option>
            </select>
          </div>

          <div className="relative">
            <SortAsc
              className="absolute left-3 top-2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treks..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tour Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <span>Visibility</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {treks.length != 0 &&
                treks?.map((trek) => (
                  <tr
                    key={trek._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={trek.thumbnail}
                          alt={trek.trekName}
                          className="h-24 w-32 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {trek.trekName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <MapPin size={10} className="mr-1" />
                              {trek.location}, {trek.country}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              trek.isActivate
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {trek.isActivate ? "Active" : "Inactive"}
                          </span>
                          <Switch
                            checked={trek.isActivate}
                            onClick={() =>
                              handleVisibility(
                                trek._id,
                                trek.isActivate ? "inactive" : "active"
                              )
                            }
                            aria-label="Toggle visibility"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(trek.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-semibold">${trek.cost}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            router.push(`/trekkings/edit-trek/${trek.slug}`)
                          }
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleDeleteTrek(trek._id, trek.trekName)
                          }}
                          className="px-4 py-2 rounded-lg hover:bg-red-600/90"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Loading and Empty States */}
      {loading && (
        <div className="flex justify-center ">
          <MainSpinner />
        </div>
      )}

      {!loading && treks?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No Treks Found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {treks?.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  )
}

export default TrekkingHome
