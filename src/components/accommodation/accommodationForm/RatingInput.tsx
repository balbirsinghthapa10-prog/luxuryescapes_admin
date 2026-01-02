// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import React from "react"

// interface RatingInputProps {
//   rating: number
//   setRating: React.Dispatch<React.SetStateAction<number>>
//   error: string
// }

// const RatingInput: React.FC<RatingInputProps> = ({
//   rating,
//   setRating,
//   error,
// }) => {
//   // Updated handler for Select component
//   const handleSelectChange = (value: string) => {
//     setRating(Number(value))
//   }

//   return (
//     <div className="mb-4">
//       <label className="block text-lg font-medium text-gray-700">
//         Rating<span className="text-red-700">*</span>
//       </label>
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <Select value={rating?.toString()} onValueChange={handleSelectChange}>
//         <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//           <SelectValue placeholder="Select Rating" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             {/* <SelectItem value="1">1 star</SelectItem>
//             <SelectItem value="2">2 star</SelectItem>
//             <SelectItem value="3">3 star</SelectItem> */}
//             <SelectItem value="4">4 star</SelectItem>
//             <SelectItem value="5">5 star</SelectItem>
//             <SelectItem value="6">Premium 5 star</SelectItem>
//             <SelectItem value="7">Boutique</SelectItem>
//             <SelectItem value="8">Premium Boutique</SelectItem>
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }

// export default RatingInput

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useState, useEffect } from "react"
import axios from "axios"

// Type definitions for the API response
interface Rating {
  _id: string
  rating: string
  ratingType: string
  __v: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: Rating[]
}

interface RatingInputProps {
  rating: string
  setRating: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const RatingInput: React.FC<RatingInputProps> = ({
  rating,
  setRating,
  error,
}) => {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  // Fetch ratings from API
  const fetchRatings = async () => {
    try {
      setLoading(true)
      setFetchError("")

      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/rating`
      )

      if (response.data.success) {
        setRatings(response.data.data)
      } else {
        setFetchError("Failed to fetch ratings")
      }
    } catch (error: any) {
      console.error("Error fetching ratings:", error)
      setFetchError(error.response?.data?.message || "Failed to fetch ratings")
    } finally {
      setLoading(false)
    }
  }

  // Fetch ratings on component mount
  useEffect(() => {
    fetchRatings()
  }, [])

  // Handler for Select component
  const handleSelectChange = (value: string) => {
    setRating(value)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Rating<span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {fetchError && <p className="text-red-500 text-sm">{fetchError}</p>}

      <Select
        value={rating?.toString()}
        onValueChange={handleSelectChange}
        disabled={loading}
      >
        <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue
            placeholder={loading ? "Loading ratings..." : "Select Rating"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {loading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : ratings.length > 0 ? (
              ratings.map((ratingItem) => (
                <SelectItem key={ratingItem._id} value={ratingItem.rating}>
                  {ratingItem.rating}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-ratings" disabled>
                No ratings available
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default RatingInput
