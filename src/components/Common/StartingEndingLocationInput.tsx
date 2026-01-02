import React from "react"
import { Input } from "../ui/input"

interface TotalDaysInputProps {
  startingLocation: string
  setStartingLocation: React.Dispatch<React.SetStateAction<string>>
  endingLocation: string
  setEndingLocation: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const StartingEndingLocationInput: React.FC<TotalDaysInputProps> = ({
  startingLocation,
  setStartingLocation,
  endingLocation,
  setEndingLocation,
  error,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartingLocation(e.target.value)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndingLocation(e.target.value)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Points <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-4 mt-1">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Starting
          </label>
          <Input
            type="text"
            value={startingLocation}
            onChange={handleMinChange}
            placeholder="Enter Arrival Location"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Ending
          </label>
          <Input
            type="text"
            value={endingLocation}
            onChange={handleMaxChange}
            placeholder="Enter Departure Location"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default StartingEndingLocationInput
