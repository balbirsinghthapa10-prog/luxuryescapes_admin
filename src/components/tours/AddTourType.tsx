"use client"
import axios from "axios"
import React from "react"
import { toast } from "sonner"

interface TripTour {
  _id: string
  tourType: string
}

interface AddTourTypeProps {
  tripsTourId: string
  setTripsTourId: (value: string) => void
  error?: string
}

const AddTourType: React.FC<AddTourTypeProps> = ({
  tripsTourId,
  setTripsTourId,
  error,
}) => {
  const [tripsTours, setTripsTours] = React.useState<TripTour[]>([])
  const [tourLoading, setTourLoading] = React.useState(false)

  // Fetch all tour types from the API
  const fetchTripsTours = async () => {
    try {
      setTourLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/get-all-tour-types`
      )
      if (response.data.success) {
        setTripsTours(response.data.allTourTypes)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching trips/tours:", error)
      toast.error("Failed to fetch Trips/Tours")
    } finally {
      setTourLoading(false)
    }
  }

  // Fetch tour types when the component mounts
  React.useEffect(() => {
    fetchTripsTours()
  }, [])

  // Handle dropdown change
  const handleTourTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTripsTourId(event.target.value)
  }

  return (
    <div className="mb-4">
      <label
        htmlFor="tourType"
        className="block text-lg font-medium text-gray-700"
      >
        Select Tour Type <span className="text-red-700">*</span>
      </label>
      <select
        id="tourType"
        value={tripsTourId}
        onChange={handleTourTypeChange}
        disabled={tourLoading}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      >
        <option value="">Select a tour type</option>
        {tripsTours.map((tour) => (
          <option key={tour._id} value={tour._id}>
            {tour.tourType}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default AddTourType
