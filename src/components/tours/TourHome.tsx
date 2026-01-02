"use client"

import React, { useEffect, useState } from "react"
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
  HeartIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CustomPagination } from "@/utils/Pagination"
import MainSpinner from "@/utils/MainLoader"
import axios from "axios"
import { count } from "console"
import { toast } from "sonner"
import Image from "next/image"

type TourType = {
  _id: string
  tourName: string
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

const TourHome: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [tours, setTours] = useState<TourType[]>([])
  const [search, setSearch] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [activated, setActivated] = useState<string>("")
  const [sort, setSort] = useState<string>("")

  const [totalPages, setTotalPages] = useState(0)

  const sortOptions = [
    // { value: "name_asc", label: "Title (A-Z)" },
    // { value: "name_desc", label: "Title (Z-A)" },
    { value: "createdAt_asc", label: "Date (Oldest First)" },
    { value: "createdAt_desc", label: "Date (Newest First)" },
    { value: "price_asc", label: "Price (Low to High)" },
    { value: "price_desc", label: "Price (High to Low)" },
  ]

  const handleGetTours = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/get/selected?page=${page}&country=${country}&sort=${sort}&search=${search}&activation=${activated}`
      )
      const data = response.data
      if (data.success) {
        setTours(data.data.tours)
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages)
        }
      }
    } catch (error: any) {
      console.error(error.response.data.message || "Failed to fetch tours")
    } finally {
      setLoading(false)
    }
  }

  const handleVisibility = async (tourId: string, status: ActivationStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/activate-tour?tourId=${tourId}`,
        {
          activation: status,
        }
      )
      const data = response.data
      if (data.success) {
        handleGetTours()
      }
    } catch (error) {
      console.error("Error updating tour visibility:", error)
      toast.error("Failed to update tour visibility")
    }
  }

  useEffect(() => {
    handleGetTours()
  }, [country, sort, activated, page])

  //debounce search
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleGetTours()
    }, 500)
    return () => clearTimeout(timeOutId)
  }, [search])

  const handleDeleteTour = async (tourId: string, tourName: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${tourName}"?`
    )
    if (!confirmDelete) return

    setLoading(true)
    const response = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/delete/${tourId}`
    )

    toast.promise(response, {
      loading: "Deleting, Please wait...",
      success: (response) => {
        const data = response.data
        if (data.success) {
          handleGetTours()

          return data.message || "Tour deleted successfully"
        } else {
          return data.message || "Failed to delete tour"
        }
      },
      error: "Failed to delete tour",
    })

    try {
      await response
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to delete tour")
    } finally {
      setLoading(false)
    }
  }

  const cloudinaryLoader = ({
    src,
    width,
    height,
    quality,
  }: {
    src: string
    width: number
    height: number
    quality: number
  }) => {
    return `${src}?w=${width}&h=${height}&q=${quality || 75}`
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Tour Manager
          </h2>
          <div className="flex  gap-6">
            <Button
              onClick={() => router.push("/tours/tour-types")}
              className="bg-blue-500 hover:bg-blue-500/90 text-white px-6 py-2 rounded-full flex items-center gap-2"
            >
              <TreePine size={20} />
              Tour Type
            </Button>
            <Button
              onClick={() => router.push("/tours/create-tour")}
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Tour
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
            <SortAsc
              className="absolute left-3 top-2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="createdAtasc">Date (Oldest First)</option>
              <option value="createdAtdesc">Date (Newest First)</option>
              <option value="asc">Price (Low to High)</option>
              <option value="desc">Price (High to Low)</option>
            </select>
          </div>
          {/* for active and inactive  */}
          <div className="relative">
            <SortAsc
              className="absolute left-3 top-2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={activated}
              onChange={(e) => setActivated(e.target.value)}
            >
              <option value="">Activate(all)</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours..."
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
              {tours.length != 0 &&
                tours?.map((tour) => (
                  <tr
                    key={tour._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={tour?.thumbnail}
                          alt={tour?.tourName}
                          className="h-24 w-32 object-cover rounded-lg shadow-sm"
                        />

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tour?.tourName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <MapPin size={10} className="mr-1" />
                              {tour?.location}, {tour?.country}
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
                              tour?.isActivate
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {tour?.isActivate ? "Active" : "Inactive"}
                          </span>
                          <Switch
                            checked={tour?.isActivate}
                            onClick={() =>
                              handleVisibility(
                                tour?._id,
                                tour?.isActivate ? "inactive" : "active"
                              )
                            }
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(tour?.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-semibold">${tour?.cost}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            router.push(`/tours/edit-tour/${tour?.slug}`)
                          }
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={loading}
                          onClick={() => {
                            handleDeleteTour(tour?._id, tour?.tourName)
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
        <div className="flex justify-center">
          <MainSpinner />
        </div>
      )}

      {!loading && tours?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No Tour Found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {tours?.length > 0 && (
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

export default TourHome
