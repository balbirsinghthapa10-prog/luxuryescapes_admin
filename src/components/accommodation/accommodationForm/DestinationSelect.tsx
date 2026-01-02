"use client"
import React, { useEffect, useState } from "react"
import { DestinationTypes } from "@/components/Types/Types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DestinationSelectProps {
  destination: string
  setDestination: (value: string) => void
}

const DestinationSelect = ({
  destination,
  setDestination,
}: DestinationSelectProps) => {
  const [loading, setLoading] = useState(false)
  const [destinations, setDestinations] = useState<DestinationTypes[]>([])

  const getDestinations = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destinations?limit=1000`,
        {
          method: "GET",
        }
      )
      const data = await response.json()

      if (data.success) {
        setDestinations(data.data.destinations)
      }
    } catch (error) {
      console.error("Failed to fetch destinations:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getDestinations()
  }, [])

  return (
    <div className="w-full">
      <label className="block text-lg font-medium text-gray-700">
        Destination <span className="text-red-700">*</span>
      </label>
      <Select value={destination} onValueChange={setDestination} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a destination" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Loading destinations...
            </SelectItem>
          ) : destinations.length > 0 ? (
            destinations.map((dest) => (
              <SelectItem key={dest._id} value={dest._id}>
                {dest.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-destinations" disabled>
              No destinations available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {loading && (
        <p className="text-gray-500 text-sm mt-2">Loading destinations...</p>
      )}
      {destinations.length === 0 && !loading && (
        <p className="text-gray-500 text-sm mt-2">
          No destinations available. Please add a destination first.
        </p>
      )}
      {/* for showing the selected destination  */}
    </div>
  )
}

export default DestinationSelect
