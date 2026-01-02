import React from "react"
import { Input } from "../ui/input"

interface TotalDaysInputProps {
  arrivalLocation: string
  setArrivalLocation: React.Dispatch<React.SetStateAction<string>>
  departureLocation: string
  setDepartureLocation: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const ArrivalDepartureLocationInput: React.FC<TotalDaysInputProps> = ({
  arrivalLocation,
  setArrivalLocation,
  departureLocation,
  setDepartureLocation,
  error,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalLocation(e.target.value)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartureLocation(e.target.value)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Locations <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-4 mt-1">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Arrival
          </label>
          <Input
            type="text"
            value={arrivalLocation}
            onChange={handleMinChange}
            placeholder="Enter Arrival Location"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Departure
          </label>
          <Input
            type="text"
            value={departureLocation}
            onChange={handleMaxChange}
            placeholder="Enter Departure Location"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default ArrivalDepartureLocationInput
