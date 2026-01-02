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
  MapPin,
  SortAsc,
  TreePine,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CustomPagination } from "@/utils/Pagination"
import MainSpinner from "@/utils/MainLoader"
import { toast } from "sonner"
import axios from "axios"
import { DestinationTypes } from "../Types/Types"
import Image from "next/image"
import { Label } from "../ui/label"

type SortField = "name" | "createdAt" | "price"
type SortOrder = "asc" | "desc"
type SortOption = {
  field: SortField
  order: SortOrder
}

interface AccommodationType {
  _id: string
  accommodationTitle: string
  accommodationLocation: string
  accommodationRating: number
  country: string
  logo?: string
  destination?: {
    _id: string
    title: string
  }
  accommodationPics: string[]
  rooms: {
    roomTitle: string
    roomPhotos: string[]
    roomStandard: string
    roomDescription: string
    roomFacilities: string[]
  }[]
  isActivated: boolean
  isFeature: boolean
  slug: string
}

const AccommodationHome: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState<number>(10)
  const [accommodations, setAccommodations] = useState<AccommodationType[]>([])
  const [search, setSearch] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [destinationFilter, setDestinationFilter] = useState<string>("")
  const [desti, setDesti] = useState<DestinationTypes[]>([])
  const [rating, setRating] = useState<string>("")

  const [sortOption, setSortOption] = useState<string>("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  const sortOptions = [
    // { value: "asc", label: "Title (A-Z)" },
    // { value: "desc", label: "Title (Z-A)" },
    { value: "asc", label: "Date (Oldest First)" },
    { value: "desc", label: "Date (Newest First)" },
  ]

  //get destinations
  const getDestinations = async () => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/destinations`,
      {
        method: "GET",
      }
    )
    const data = await response.json()

    if (data.success) {
      setDesti(data.data.destinations)
    }

    setLoading(false)
  }

  const getAccommodations = async () => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/get-selected-data?page=${page}&limit=${limit}&search=${search}&location=${country}&sort=${sortOption}&rating=${rating}&destination=${destinationFilter}`,
      {
        method: "GET",
      }
    )
    const data = await response.json()

    if (data.success) {
      setAccommodations(data.data.formattedData)
      if (data.data.pagination) {
        setTotalPages(data.data.pagination.totalPages)
      }
    }

    setLoading(false)
  }

  const deleteAccommodation = async (id: string, name: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`)
    if (!confirmDelete) return

    setLoading(true)
    const response = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/delete/${id}`
    )

    toast.promise(response, {
      loading: "Deleting, Please wait...",
      success: (response) => {
        const data = response.data
        if (data.success) {
          getAccommodations()

          return data.message || "Deleted successfully"
        } else {
          return data.message || "Failed to delete"
        }
      },
      error: "Failed to delete",
    })

    try {
      await response
    } catch (error) {
      toast.error("Failed to delete Accommodation")
    } finally {
      setLoading(false)
    }
  }

  //update feature status
  const handleUpdateFeatureStatus = async (
    id: string | null,
    isFeature: boolean
  ) => {
    if (id !== null) {
      try {
        // setLoading(true)
        const response = await axios.patch(
          `${
            process.env.NEXT_PUBLIC_API_URL_PROD
          }/accommodation/update/${id}?isfeature=${!isFeature}`
        )
        const data = response.data

        if (data.success) {
          toast.success(
            data.data?.message || "Accommodation feature status updated"
          )
        } else {
          toast.error(data.data?.message || "Failed to update feature status")
        }
      } catch (error) {
        toast.error("Failed to update feature status")
      } finally {
        // setLoading(false)
        getAccommodations()
      }
    }
  }

  useEffect(() => {
    getAccommodations()
  }, [page, country, sortOption, rating, destinationFilter])

  useEffect(() => {
    getDestinations()
  }, [])

  //debouncing for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAccommodations()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Hotel/Resort Manager
          </h2>
          <div className="flex  gap-6">
            <Button
              onClick={() => router.push("/accommodations/add-accommodation")}
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Hotel/Resort
            </Button>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          Manage your luxurious hotel/resort with multiple options
        </p>
      </div>

      {/* Filters Section */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative">
            <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Ratings (All)</option>
              <option value="1">1 star</option>
              <option value="2">2 star</option>
              <option value="3">3 star</option>
              <option value="4">4 star</option>
              <option value="5">5 star</option>
            </select>
          </div>

          <div className="relative">
            <MapIcon
              className="absolute left-3 top-2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">All Country</option>
              <option value="Nepal">Nepal</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Tibet">Tibet</option>
              <option value="Multidestination">Multidestination</option>
            </select>
          </div>
          <div className="relative">
            <MapIcon
              className="absolute left-3 top-2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
            >
              <option value="">Destination (all)</option>
              {desti &&
                desti.map((d) => {
                  return (
                    <option key={d._id} value={d._id}>
                      {d.title}
                    </option>
                  )
                })}
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
              placeholder="Search accommodation..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Card>

      {/* Rest of the component remains the same */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tour Details
                  {/* Tour Details ({accommodations.length}/{dummyTrekking.length}) */}
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Featured
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {accommodations.length != 0 &&
                accommodations.map((acco) => (
                  <tr
                    key={acco._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={acco?.accommodationPics[0] || "/going.png"}
                          alt={acco?.accommodationTitle}
                          className=" object-cover rounded-lg shadow-sm"
                          width={128}
                          height={96}
                        />
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            {acco?.accommodationTitle}
                            {acco?.logo && (
                              <Image
                                src={acco?.logo}
                                alt={acco?.accommodationTitle}
                                className=" object-cover rounded-full shadow-sm"
                                width={20}
                                height={20}
                              />
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <MapPin size={10} className="mr-1" />
                              {acco?.accommodationLocation},
                              {acco?.destination?.title}, {acco?.country}
                            </Badge>
                          </div>
                          <div className="mt-1 space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              <Star size={10} className="mr-1" />
                              <span>{acco?.accommodationRating}</span>
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs"text-yellow-600 border-yellow-200 bg-yellow-50
                                  
                              }`}
                            >
                              {acco?.rooms?.length} Rooms
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 ">
                      <div className="flex gap-4 items-center justify-center">
                        <Switch
                          id="is-feature"
                          checked={acco.isFeature}
                          onCheckedChange={(checked) =>
                            handleUpdateFeatureStatus(acco._id, !checked)
                          }
                        />
                        <Label htmlFor="is-feature">
                          {acco.isFeature ? "Featured" : "Not Featured"}
                        </Label>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            router.push(
                              `/accommodations/edit-accommodation/${acco.slug}`
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={deleteLoading}
                          onClick={() => {
                            deleteAccommodation(
                              acco._id,
                              acco.accommodationTitle
                            )
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

      {!loading && accommodations?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No Accommodation Found
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {accommodations?.length > 0 && (
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

export default AccommodationHome
