import React from "react"
import { Input } from "../ui/input"

interface InputProps {
  maxAltitude: number
  setMaxAltitude: React.Dispatch<React.SetStateAction<number>>
  error: string
}

const MaxAltitudeInput: React.FC<InputProps> = ({
  maxAltitude,
  setMaxAltitude,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAltitude(Number(e.target.value))
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Max Altitude <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="number"
        value={maxAltitude}
        onChange={handleChange}
        placeholder="Enter Max Altitude"
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default MaxAltitudeInput
