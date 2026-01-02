import React from "react"
import { Input } from "../ui/input"

interface DurationProps {
  days: number
  setDays: React.Dispatch<React.SetStateAction<number>>
  error: string
}

const Duration: React.FC<DurationProps> = ({ days, setDays, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(Number(e.target.value))
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Duration (in days) <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="number"
        value={days}
        onChange={handleChange}
        placeholder="Enter duration in days"
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default Duration
