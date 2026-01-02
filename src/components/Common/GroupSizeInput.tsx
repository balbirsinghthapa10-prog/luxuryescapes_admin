import React from "react"
import { Input } from "../ui/input"

interface TotalDaysInputProps {
  minGroupSize: number
  setMinGroupSize: React.Dispatch<React.SetStateAction<number>>
  maxGroupSize: number
  setMaxGroupSize: React.Dispatch<React.SetStateAction<number>>
  error: string
}

const GroupSizeInput: React.FC<TotalDaysInputProps> = ({
  minGroupSize,
  setMinGroupSize,
  maxGroupSize,
  setMaxGroupSize,
  error,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinGroupSize(Number(e.target.value))
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxGroupSize(Number(e.target.value))
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Group Size <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-4 mt-1">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Min Size
          </label>
          <Input
            type="number"
            value={minGroupSize}
            onChange={handleMinChange}
            placeholder="Minimum Group Size"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Max Size
          </label>
          <Input
            type="number"
            value={maxGroupSize}
            onChange={handleMaxChange}
            placeholder="Maximum Group Size"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default GroupSizeInput
