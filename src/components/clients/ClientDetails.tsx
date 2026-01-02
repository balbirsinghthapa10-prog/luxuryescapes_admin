"use client"
import MainSpinner from "@/utils/MainLoader"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  Globe2Icon,
  MailIcon,
  Plus,
  SortAsc,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { countries } from "./AllCountries"
import Link from "next/link"

interface UserTypes {
  _id: string
  name: string
  email: string
  country: string
  number: string
  company: string
  address: string
}

const ClientDetails = () => {
  const [users, setUsers] = useState<UserTypes[]>([])
  const [allCountries, setAllCountries] = useState<string[]>([])
  const [country, setCountry] = useState("")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(30)
  const router = useRouter()

  const getClientDetailsHandler = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/agent/get?page=${page}&limit=${limit}&search=${search}&country=${country}`
      )
      const data = response.data
      if (data.success) {
        setUsers(data.data)
      } else {
        toast.error(data.message || "Something Went Wrong")
      }
    } catch (error: any) {
      toast.error(error.message || "Something Went Wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = async (userId: string, name: string) => {
    const confirmation = window.confirm(`Confirm Delete Client : ${name}?`)
    if (!confirmation) return

    setLoading(true)

    const deletePromise = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/delete-user/${userId}`
    )

    toast.promise(deletePromise, {
      loading: "Deleting, Please wait...",
      success: (response) => {
        // This will be called after successful deletion
        getClientDetailsHandler()
        setLoading(false)
        return response.data.message || "Client Deleted Successfully."
      },
      error: (error) => {
        console.error(error)
        setLoading(false)
        return "Failed to delete client"
      },
    })
  }

  useEffect(() => {
    setAllCountries(countries)
    getClientDetailsHandler()
  }, [country, page])

  //debounce
  useEffect(() => {
    const timeOut = setTimeout(() => {
      getClientDetailsHandler()
    }, 500)
    return () => clearTimeout(timeOut)
  }, [search])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Clients Manager</h2>
          <div className="flex items-center gap-4">
            <Link href="/quotes/bulk-mailing">
              <Button className="bg-primary hover:bg-secondary text-black px-6 py-2 rounded-lg flex items-center gap-2">
                <MailIcon size={20} />
                Send Bulk Mail
              </Button>
            </Link>
            {/* add new client  */}
            <Button
              onClick={() => router.push("/clients/add-client")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Client
            </Button>
          </div>
        </div>
        <p className="text-gray-600">Manage your user details options</p>
      </div>

      {/* Filters Section  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* country  */}
        <div className="relative">
          <Globe2Icon
            className="absolute left-3 top-2 text-gray-400"
            size={20}
          />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Country</option>
            {allCountries.map((c) => (
              <option key={c} value={c.toLowerCase()}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-md font-semibold ">
                      {user.name ? user.name : "N/A"}
                    </h3>
                  </div>
                </td>

                {/* email  */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.email ? user.email : "N/A"}
                    </span>
                  </div>
                </td>

                {/* contact  */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.number ? user.number : "N/A"}
                    </span>
                  </div>
                </td>
                {/* company  */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.company ? user.company : "N/A"}
                    </span>
                  </div>
                </td>

                {/* country  */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium  ">
                      {user.address ? user.address : ""}
                      {" - "}
                      {user.country ? user.country : "N/A"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(user._id, user.name)}
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

      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No users found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}

export default ClientDetails
