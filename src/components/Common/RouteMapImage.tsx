"use client"
import React, { useState } from "react"
import { Input } from "../ui/input"
import Image from "next/image"

interface ThumbnailInputProps {
  routeImage: File | null
  setRouteImage: React.Dispatch<React.SetStateAction<File | null>>
  routeImagePreview: string | null
  error?: string
}

const RouteMapImage: React.FC<ThumbnailInputProps> = ({
  routeImage,
  setRouteImage,
  routeImagePreview,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(
    routeImage ? URL.createObjectURL(routeImage) : null
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setRouteImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Route Map Image
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
      {preview && (
        <div className="mt-2">
          <label className="block text-lg font-medium text-gray-700">
            New:
          </label>
          <Image
            src={preview}
            alt="Route Map Preview"
            width={384}
            height={224}
            className="h-56 w-96 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}
      {routeImagePreview && (
        <div className="mt-2">
          <label className="block text-lg font-medium text-gray-700">
            Current:
          </label>
          <Image
            src={routeImagePreview}
            alt="Thumbnail Preview"
            width={384}
            height={224}
            className="h-56 w-96 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}
    </div>
  )
}

export default RouteMapImage
