"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { Button } from "../ui/button"
import { Trash2, Plus, SortAsc, MapPin, Calendar, Mail } from "lucide-react"

// import { CustomPagination } from "../utils/Pagination"
import { toast } from "sonner"
import Link from "next/link"
import MainSpinner from "@/utils/MainLoader"

// import { DeleteRequestMail } from "./DeleteRequestMail"

interface TailorMadeType {
  _id: string
  firstName: string
  lastName: string
  email: string
  country: string
  status: string

  budget: string
  createdAt: string
}

interface tabsType {
  key: string
  label: string
  count: number
}

interface Counts {
  quotePending: number
  customizePending: number
}

const TailorMadeHome: React.FC = () => {
  const router = useRouter()
  const [requests, setRequests] = useState<TailorMadeType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [sort, setSort] = useState<string>("-createdAt")
  const [activeTab, setActiveTab] = useState<string>("quote")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRequestToDelete, setSelectedRequestToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const [counts, setCounts] = useState<Counts>({
    quotePending: 0,
    customizePending: 0,
  })

  // Fetch requests data with filters
  const getRequests = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tailor-made/get`,
        {
          params: {
            page,
            limit,
            requestType: activeTab,
            sort,
          },
        }
      )

      if (response.data.success) {
        setRequests(response.data.data)
        // setTotalPages(response.data.totalPages)
      }
    } catch (error: any) {
      console.error(
        error.response.data.message || "Failed to fetch request data"
      )
    } finally {
      setLoading(false)
    }
  }

  //   useEffect(() => {
  //     getCounts()
  //   }, [activeTab])

  useEffect(() => {
    getRequests()
  }, [page, limit, sort, activeTab])

  const confirmDelete = async (id: string, name: string) => {
    const confirmation = confirm(
      `Are you sure you want to delete "${name}" request?`
    )
    if (!confirmation) return

    const response = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/tailor-made/delete/${id}`
    )

    toast.promise(response, {
      loading: "Deleting, please wait...",
      success: (response) => {
        const data = response.data
        if (data.success) {
          getRequests()
          return data.message || "Request deleted successfully"
        } else {
          return data.message || "Failed to delete request"
        }
      },
      error: (error) => {
        return error.message || "Failed to delete request"
      },
    })

    try {
      setDeleteLoading(true)
      await response
    } catch (error) {
      setDeleteLoading(false)
      toast.error("Failed to delete blog")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  //for days ago
  const getDaysAgo = (date: string) => {
    const createdAt = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - createdAt.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 0 ? "Today" : `${diffDays} days ago`
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Tailor Made Management
          </h2>
          {/* <Link href="/requests-mails/bulk-mailing">
            <Button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Mail size={20} />
              Send Bulk Mail
            </Button>
          </Link> */}
        </div>
        <p className="text-gray-600">
          Manage and track incoming requests from users
        </p>
      </div>
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Sort by...</option>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="fullName">Name A-Z</option>
            <option value="-fullName">Name Z-A</option>
          </select>
        </div>
      </div>
      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {requests.map((request) => (
              <tr
                key={request._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.firstName} {request.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <span
                          className={`text-md bg-orange-500 font-semibold p-1 rounded-xl`}
                        >
                          {request.country}
                        </span>
                        <span
                          className={`text-md bg-green-500 font-semibold p-1 rounded-xl`}
                        >
                          {request?.email}
                        </span>
                        <span
                          className={`text-md bg-purple-500 font-semibold p-1 rounded-xl`}
                        >
                          {request?.budget}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <Calendar size={16} className="text-primary" />
                        {new Date(request.createdAt).toLocaleDateString()} (
                        {getDaysAgo(request.createdAt)})
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-md ${
                        request.status === "pending"
                          ? "text-orange-600"
                          : request.status === "mailed"
                          ? "text-blue-600"
                          : "text-green-600"
                      } font-semibold `}
                    >
                      {request.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Link href={`/tailor-made/view/${request._id}`}>
                      <Button className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg">
                        View Details
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      onClick={() =>
                        confirmDelete(request._id, request.firstName)
                      }
                      className="px-4 py-2 rounded-lg "
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
      {/* Loading and Empty States */}

      {loading && (
        <div className="flex justify-center">
          <MainSpinner />
        </div>
      )}
      {!loading && requests?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No Requests Found
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* <DeleteRequestMail
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
      loading={deleteLoading}
        itemName={
          requests.find((b) => b._id === selectedRequestToDelete)?.name || ""
        }
      /> */}
      {/* Pagination */}
      {/* {requests.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )} */}
    </div>
  )
}

export default TailorMadeHome
