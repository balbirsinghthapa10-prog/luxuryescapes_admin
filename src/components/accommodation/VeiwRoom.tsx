"use client"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Image from "next/image"

interface Room {
  _id: string
  roomTitle: string
  slug: string
  roomPhotos: string[]
  roomStandard: string
  roomDescription: string
  roomFacilities: string[]
}

interface Accommodation {
  _id: string
  accommodationPics: string[]
  accommodationTitle: string
  slug: string
  accommodationLocation: string
  accommodationRating: number
  accommodationDescription: string
  accommodationFeatures: string[]
  accommodationAmenities: string[]
  rooms: Room[]
}

const ViewRoom: React.FC<{ slug: string }> = ({ slug }) => {
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const handleGetAccommodation = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/get-by/${slug}`
      )
      setAccommodation(response.data.data)
    } catch (err) {
      console.error("Failed to fetch accommodation data:", err)
      setError("Failed to load accommodation details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      handleGetAccommodation()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleGetAccommodation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!accommodation) {
    return <div className="text-center p-8">No accommodation found</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Accommodation header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {accommodation.accommodationTitle}
        </h1>
        <div className="flex items-center mb-4">
          <span className="text-gray-600 mr-4">
            {accommodation.accommodationLocation}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < accommodation.accommodationRating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          {accommodation.accommodationDescription}
        </p>
      </div>

      {/* Rooms section */}
      <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>

      {accommodation.rooms.length === 0 ? (
        <p className="text-gray-500">
          No rooms available for this accommodation.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodation.rooms.map((room) => (
            <div
              key={room._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Room image */}
              <div className="relative h-48 w-full">
                {room.roomPhotos && room.roomPhotos.length > 0 ? (
                  <img
                    src={room.roomPhotos[0]}
                    alt={room.roomTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              {/* Room details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{room.roomTitle}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {room.roomStandard}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{room.roomDescription}</p>

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Facilities:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {room.roomFacilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accommodation features & amenities */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Property Features</h3>
          <ul className="space-y-2">
            {accommodation.accommodationFeatures.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Amenities</h3>
          <ul className="space-y-2">
            {accommodation.accommodationAmenities.map((amenity, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ViewRoom
