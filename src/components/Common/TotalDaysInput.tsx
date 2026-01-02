import React from "react"
import { Input } from "../ui/input"

interface TotalDaysInputProps {
  minDays: number
  setMinDays: React.Dispatch<React.SetStateAction<number>>
  maxDays: number
  setMaxDays: React.Dispatch<React.SetStateAction<number>>
  error: string
}

const TotalDaysInput: React.FC<TotalDaysInputProps> = ({
  minDays,
  setMinDays,
  maxDays,
  setMaxDays,
  error,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinDays(Number(e.target.value))
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDays(Number(e.target.value))
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Total Days <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-4 mt-1">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Min Days
          </label>
          <Input
            type="number"
            value={minDays}
            onChange={handleMinChange}
            placeholder="Minimum Days"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Max Days
          </label>
          <Input
            type="number"
            value={maxDays}
            onChange={handleMaxChange}
            placeholder="Maximum Days"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default TotalDaysInput
