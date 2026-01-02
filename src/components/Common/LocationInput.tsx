import { Input } from "@/components/ui/input"
import React from "react"

interface InputProps {
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const LocationInput: React.FC<InputProps> = ({
  location,
  setLocation,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value)
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Location <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="text"
        value={location}
        onChange={handleChange}
        placeholder="Enter location"
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default LocationInput
