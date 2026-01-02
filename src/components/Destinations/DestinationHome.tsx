"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

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
import Image from "next/image"
import { DestinationTypes } from "../Types/Types"

type SortField = "name" | "createdAt" | "price"
type SortOrder = "asc" | "desc"
type SortOption = {
  field: SortField
  order: SortOrder
}

const DestinationHome: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(0)

  const [destinations, setDestinations] = useState<DestinationTypes[]>([])
  const [search, setSearch] = useState<string>("")

  const [deleteLoading, setDeleteLoading] = useState(false)

  const sortOptions = [
    // { value: "asc", label: "Title (A-Z)" },
    // { value: "desc", label: "Title (Z-A)" },
    { value: "asc", label: "Date (Oldest First)" },
    { value: "desc", label: "Date (Newest First)" },
  ]

  const getDestinations = async () => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/destinations?page=${page}&limit=${limit}&search=${search}`,

      {
        method: "GET",
      }
    )
    const data = await response.json()

    if (data.success) {
      setDestinations(data.data.destinations)
      if (data.data.pagination) {
        setTotalPages(data.data.pagination.totalPages)
      }
    }

    setLoading(false)
  }

  const deleteDestination = async (id: string, name: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`)
    if (!confirmDelete) return

    setLoading(true)
    const response = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/delete/${id}`
    )

    toast.promise(response, {
      loading: "Deleting, Please wait...",
      success: (response) => {
        const data = response.data
        if (data.success) {
          getDestinations()

          return data.message || "Deleted successfully"
        } else {
          return data.message || "Failed to delete"
        }
      },
      error: "Failed to delete",
    })

    try {
      await response
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to delete destination")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDestinations()
  }, [page])

  //debouncing for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getDestinations()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Destination Manager
          </h2>
          <div className="flex  gap-6">
            <Button
              onClick={() => router.push("destinations/add-destination")}
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Destination
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
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
                  {/* Tour Details ({destinations.length}/{dummyTrekking.length}) */}
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {destinations &&
                destinations.map((desti) => (
                  <tr
                    key={desti._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={desti?.thumbnail || "/going.png"}
                          alt={desti?.title}
                          width={80}
                          height={80}
                          className=" rounded-md object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {desti?.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {desti?.description.slice(0, 70)}.
                            {desti?.description.length > 50 && "..."}{" "}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            router.push(`/destinations/${desti._id}`)
                          }
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={deleteLoading}
                          onClick={() => {
                            deleteDestination(desti._id, desti.title)
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

      {!loading && destinations?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No Destination Found
          </p>
          <p className="text-gray-500 mt-2">Try adjusting your search</p>
        </div>
      )}

      {/* Pagination */}
      {destinations?.length > 0 && (
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

export default DestinationHome
