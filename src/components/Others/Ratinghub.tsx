// "use client"
// import React, { useEffect, useState } from "react"
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Search,
//   Filter,
//   Star,
//   Hotel,
//   UtensilsCrossed,
//   ChevronLeft,
// } from "lucide-react"
// import { Input } from "../ui/input"
// import axios from "axios"
// import { useRouter } from "next/navigation"

// interface Rating {
//   _id: string
//   rating: string
//   ratingType: "hotel" | "dining"
// }

// interface FormData {
//   rating: string
//   ratingType: "hotel" | "dining"
// }

// const Ratinghub: React.FC = () => {
//   const [ratings, setRatings] = useState<Rating[]>([])
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
//   const [editingRating, setEditingRating] = useState<Rating | null>(null)
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [filterType, setFilterType] = useState<"all" | "hotel" | "dining">(
//     "all"
//   )
//   const [formData, setFormData] = useState<FormData>({
//     rating: "",
//     ratingType: "hotel",
//   })
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string>("")

//   const router = useRouter()

//   // Filter ratings based on search and type filter
//   const filteredRatings = ratings.filter((rating) => {
//     // Add safety check for rating.rating
//     const ratingText = rating.rating || ""
//     const matchesSearch = ratingText
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//     const matchesType = filterType === "all" || rating.ratingType === filterType
//     return matchesSearch && matchesType
//   })

//   const handleGetRatings = async () => {
//     try {
//       setLoading(true)
//       setError("")
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating`
//       )
//       setRatings(response.data.data)
//     } catch (error) {
//       console.error("Error fetching ratings:", error)
//       setError("Failed to fetch ratings")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleOpenModal = (rating: Rating | null = null): void => {
//     if (rating) {
//       setEditingRating(rating)
//       setFormData({ rating: rating.rating, ratingType: rating.ratingType })
//     } else {
//       setEditingRating(null)
//       setFormData({ rating: "", ratingType: "hotel" })
//     }
//     setIsModalOpen(true)
//   }

//   const handleCloseModal = (): void => {
//     setIsModalOpen(false)
//     setEditingRating(null)
//     setFormData({ rating: "", ratingType: "hotel" })
//     setError("")
//   }

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ): Promise<void> => {
//     e.preventDefault()
//     if (!formData.rating.trim()) return

//     try {
//       setLoading(true)
//       setError("")

//       if (editingRating) {
//         // Update existing rating
//         const response = await axios.patch(
//           `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating/edit/${editingRating._id}`,
//           formData
//         )

//         // Ensure we're using the correct data structure
//         const updatedRating = response.data.data || response.data

//         // Update the ratings state with the updated rating
//         setRatings(
//           ratings.map((rating) =>
//             rating._id === editingRating._id ? updatedRating : rating
//           )
//         )
//       } else {
//         // Add new rating
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating/add`,
//           formData
//         )

//         // Ensure we're using the correct data structure
//         const newRating = response.data.data || response.data

//         // Add the new rating to the state
//         setRatings([...ratings, newRating])
//       }

//       handleCloseModal()
//     } catch (error: any) {
//       console.error("Error saving rating:", error)
//       setError(
//         error.response?.data?.message ||
//           `Failed to ${editingRating ? "update" : "create"} rating`
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string): Promise<void> => {
//     if (!window.confirm("Are you sure you want to delete this rating?")) {
//       return
//     }

//     try {
//       setLoading(true)
//       setError("")

//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating/delete/${id}`
//       )

//       // Remove the deleted rating from state
//       setRatings(ratings.filter((rating) => rating._id !== id))
//     } catch (error: any) {
//       console.error("Error deleting rating:", error)
//       setError(error.response?.data?.message || "Failed to delete rating")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getTypeIcon = (type: "hotel" | "dining"): React.ReactElement => {
//     return type === "hotel" ? (
//       <Hotel className="w-4 h-4" />
//     ) : (
//       <UtensilsCrossed className="w-4 h-4" />
//     )
//   }

//   const getTypeColor = (type: "hotel" | "dining"): string => {
//     return type === "hotel"
//       ? "bg-blue-100 text-blue-800"
//       : "bg-green-100 text-green-800"
//   }

//   useEffect(() => {
//     handleGetRatings()
//   }, [])

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//             <ChevronLeft
//               onClick={() => router.back()}
//               className="w-8 h-8 text-yellow-500"
//             />
//             Rating Hub
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Manage rating types for hotels and dining establishments
//           </p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//         >
//           <Plus className="w-4 h-4" />
//           Add Rating
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//           {error}
//         </div>
//       )}

//       {/* Loading Indicator */}
//       {loading && (
//         <div className="text-center py-4 mb-6">
//           <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//           <span className="ml-2 text-gray-600">Loading...</span>
//         </div>
//       )}

//       {/* Search and Filter Bar */}
//       <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               type="text"
//               placeholder="Search ratings..."
//               value={searchTerm}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setSearchTerm(e.target.value)
//               }
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div className="relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <select
//               value={filterType}
//               onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//                 setFilterType(e.target.value as "all" | "hotel" | "dining")
//               }
//               className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//             >
//               <option value="all">All Types</option>
//               <option value="hotel">Hotels</option>
//               <option value="dining">Dining</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Ratings Table */}
//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Type
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rating Name
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredRatings.map((rating) => (
//               <tr
//                 key={rating._id}
//                 className="hover:bg-gray-50 transition-colors"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center gap-2">
//                     {getTypeIcon(rating.ratingType)}
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
//                         rating.ratingType
//                       )}`}
//                     >
//                       {rating.ratingType.charAt(0).toUpperCase() +
//                         rating.ratingType.slice(1)}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {rating.rating || "N/A"}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => handleOpenModal(rating)}
//                       disabled={loading}
//                       className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:text-gray-300 disabled:cursor-not-allowed rounded transition-colors"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(rating._id)}
//                       disabled={loading}
//                       className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:text-gray-300 disabled:cursor-not-allowed rounded transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Empty State */}
//       {filteredRatings.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No ratings found
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {searchTerm || filterType !== "all"
//               ? "Try adjusting your search or filter criteria"
//               : "Get started by adding your first rating"}
//           </p>
//           {!searchTerm && filterType === "all" && (
//             <button
//               onClick={() => handleOpenModal()}
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               Add Rating
//             </button>
//           )}
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold mb-6">
//                 {editingRating ? "Edit Rating" : "Add New Rating"}
//               </h2>

//               {/* Error in Modal */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Rating Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.rating}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setFormData({ ...formData, rating: e.target.value })
//                     }
//                     placeholder="e.g., Excellent, Very Good, Good"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Type
//                   </label>
//                   <select
//                     value={formData.ratingType}
//                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//                       setFormData({
//                         ...formData,
//                         ratingType: e.target.value as "hotel" | "dining",
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     disabled={loading}
//                   >
//                     <option value="hotel">Hotel</option>
//                     <option value="dining">Dining</option>
//                   </select>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     disabled={loading}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//                   >
//                     {loading && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     )}
//                     {editingRating ? "Update" : "Create"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Ratinghub

"use client"
import React, { useEffect, useState } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Star,
  Hotel,
  UtensilsCrossed,
  ChevronLeft,
} from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import axios from "axios"
import { useRouter } from "next/navigation"

interface Rating {
  _id: string
  rating: string
  ratingType: "hotel" | "dining"
}

interface FormData {
  rating: string
  ratingType: "hotel" | "dining"
}

const Ratinghub: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingRating, setEditingRating] = useState<Rating | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterType, setFilterType] = useState<"all" | "hotel" | "dining">(
    "all"
  )
  const [formData, setFormData] = useState<FormData>({
    rating: "",
    ratingType: "hotel",
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const router = useRouter()

  // Filter ratings based on search and type filter
  const filteredRatings = ratings.filter((rating) => {
    const ratingText = rating.rating || ""
    const matchesSearch = ratingText
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || rating.ratingType === filterType
    return matchesSearch && matchesType
  })

  const handleGetRatings = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating`
      )
      setRatings(response.data.data)
    } catch (error) {
      console.error("Error fetching ratings:", error)
      setError("Failed to fetch ratings")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (rating: Rating | null = null): void => {
    if (rating) {
      setEditingRating(rating)
      setFormData({ rating: rating.rating, ratingType: rating.ratingType })
    } else {
      setEditingRating(null)
      setFormData({ rating: "", ratingType: "hotel" })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setEditingRating(null)
    setFormData({ rating: "", ratingType: "hotel" })
    setError("")
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    if (!formData.rating.trim()) return

    try {
      setLoading(true)
      setError("")

      if (editingRating) {
        // Update existing rating
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating/edit/${editingRating._id}`,
          formData
        )

        const updatedRating = response.data.data || response.data

        setRatings(
          ratings.map((rating) =>
            rating._id === editingRating._id ? updatedRating : rating
          )
        )
      } else {
        // Add new rating
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating/add`,
          formData
        )

        const newRating = response.data.data || response.data

        setRatings([...ratings, newRating])
      }

      handleCloseModal()
    } catch (error: any) {
      console.error("Error saving rating:", error)
      setError(
        error.response?.data?.message ||
          `Failed to ${editingRating ? "update" : "create"} rating`
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this rating?")) {
      return
    }

    try {
      setLoading(true)
      setError("")

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating/delete/${id}`
      )

      setRatings(ratings.filter((rating) => rating._id !== id))
    } catch (error: any) {
      console.error("Error deleting rating:", error)
      setError(error.response?.data?.message || "Failed to delete rating")
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: "hotel" | "dining"): React.ReactElement => {
    return type === "hotel" ? (
      <Hotel className="w-5 h-5 text-gray-500" />
    ) : (
      <UtensilsCrossed className="w-5 h-5 text-gray-500" />
    )
  }

  const getTypeColor = (type: "hotel" | "dining"): string => {
    return type === "hotel"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800"
  }

  useEffect(() => {
    handleGetRatings()
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ChevronLeft
              onClick={() => router.back()}
              className="w-8 h-8 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
            />
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Rating Manager
            </h2>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Rating
          </Button>
        </div>
        <p className="text-lg text-gray-600">
          Manage rating types for hotels and dining establishments
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search ratings..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as "all" | "hotel" | "dining")
              }
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="hotel">Hotels</option>
              <option value="dining">Dining</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rating Details
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRatings.length > 0 ? (
                filteredRatings.map((rating) => (
                  <tr
                    key={rating._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {rating.rating || "Untitled Rating"}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center space-x-2">
                            {getTypeIcon(rating.ratingType)}
                            <span className="font-medium capitalize">
                              {rating.ratingType} Rating
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          rating.ratingType
                        )}`}
                      >
                        {rating.ratingType.charAt(0).toUpperCase() +
                          rating.ratingType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() => handleOpenModal(rating)}
                          disabled={loading}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          <Edit2 size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(rating._id)}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg hover:bg-red-600/90"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-12">
                    {searchTerm || filterType !== "all"
                      ? "No ratings found matching your criteria."
                      : "No ratings found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-6">
          <span className="text-gray-500">Loading ratings...</span>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingRating ? "Edit Rating" : "Add New Rating"}
              </h2>

              {/* Error in Modal */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating Name
                  </label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    placeholder="e.g., Excellent, Very Good, Good"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.ratingType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFormData({
                        ...formData,
                        ratingType: e.target.value as "hotel" | "dining",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="hotel">Hotel</option>
                    <option value="dining">Dining</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {editingRating ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ratinghub
