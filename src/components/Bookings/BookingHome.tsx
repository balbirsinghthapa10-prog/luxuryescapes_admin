"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "../ui/button"
import {
  Trash2,
  SortAsc,
  Calendar,
  Phone,
  MapPin,
  RefreshCcw,
} from "lucide-react"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { CustomPagination } from "@/utils/Pagination"
import MainSpinner from "@/utils/MainLoader"

interface BookingData {
  _id: string
  fullName: string
  email: string
  phone: string
  address: string
  adventureType: "trek" | "tour" | "wellness" | "activity"
  trekId: string | null
  tourId: string | null
  wellnessId: string | null
  activityId: string | null
  bookingDate: string
  extraServices: string | null
  soloStandard: string | null
  totalPrice: number
  createdAt: string
  updatedAt: string
  status: string
  __v: number
}

const BookingHome: React.FC = () => {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [adventureTypeSort, setAdventureTypeSort] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(1)
  const [sort, setSort] = useState<string>("-createdAt")

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBookingToDelete, setSelectedBookingToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  // Fetch bookings data with filters
  const getBookings = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/booking/get-all`,
        {
          params: {
            page,
            limit,
            sort,
            adventureTypeSort,
          },
        }
      )

      if (response.data.success) {
        setBookings(response.data.data)
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages)
        }
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (bookingId: string) => {
    setSelectedBookingToDelete(bookingId)
    setDeleteModalOpen(true)
  }

  useEffect(() => {
    getBookings()
  }, [page, limit, sort, adventureTypeSort])

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedBookingToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/booking/delete/${selectedBookingToDelete}`
        )
        if (response.data.success) {
          setDeleteLoading(false)
          toast.success(response.data.message || "Booking deleted successfully")
          getBookings()
        } else {
          setDeleteLoading(false)
          toast.error(response.data.message || "Failed to delete booking")
        }
      }
    } catch (error) {
      setDeleteLoading(false)
      toast.error("Failed to delete booking")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  const formatDateString = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to get adventure type badge color
  const getAdventureTypeColor = (type: string) => {
    switch (type) {
      case "Trekking":
        return "bg-green-600"
      case "Tour":
        return "bg-orange-600"
      case "Wellness":
        return "bg-blue-600"
      case "Activity":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const handleRefresh = () => {
    getBookings()
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Booking Management
            </h2>
          </div>
          <p className="text-gray-600">
            Manage and track incoming bookings from users
          </p>
        </div>
        <div>
          <Button onClick={handleRefresh}>
            <RefreshCcw
              className={`w-6 h-6 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
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
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="fullName">Name A-Z</option>
            <option value="-fullName">Name Z-A</option>
            <option value="totalPrice">Price: Low to High</option>
            <option value="-totalPrice">Price: High to Low</option>
            <option value="bookingDate">Booking Date: Earlier First</option>
            <option value="-bookingDate">Booking Date: Later First</option>
          </select>
        </div>
        <div className="relative">
          <select
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            onChange={(e) => {
              setAdventureTypeSort(e.target.value)
              setPage(1)
            }}
            defaultValue=""
          >
            <option value="all">All Adventure Types</option>
            <option value="Trekking">Trekking</option>
            <option value="Tour">Tour</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Booking Info
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {bookings.length != 0 &&
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-blue-900">{booking.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${getAdventureTypeColor(
                            booking.adventureType
                          )} text-white font-medium px-2 py-1 rounded-md uppercase`}
                        >
                          {booking.adventureType}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Booking Date:</span>{" "}
                        {formatDateString(booking.bookingDate)}
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {formatDateString(booking.createdAt)}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-blue-900">
                      ${booking.totalPrice}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-md font text-white rounded-lg p-2 ${
                        booking.status === "pending"
                          ? "bg-yellow-500"
                          : booking.status === "viewed"
                          ? "bg-blue-500"
                          : booking.status === "mailed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        onClick={() => router.push(`/bookings/${booking._id}`)}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
                      >
                        View Details
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteClick(booking._id)}
                        className="px-4 py-2 rounded-lg"
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
        <div className="flex justify-center ">
          <MainSpinner />
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No Bookings Found
          </p>
          <p className="text-gray-500 mt-2">
            There are no bookings matching your current filters.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking from{" "}
              <span className="font-semibold">
                {bookings.find((b) => b._id === selectedBookingToDelete)
                  ?.fullName || ""}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {bookings.length > 0 && (
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

export default BookingHome
