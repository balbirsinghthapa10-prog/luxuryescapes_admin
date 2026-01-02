import React from "react"
import { Input } from "../ui/input"

interface InputProps {
  suitableAge: string
  setSuitableAge: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const AgeInput: React.FC<InputProps> = ({
  suitableAge,
  setSuitableAge,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuitableAge(e.target.value)
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Suitable Age <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="text"
        value={suitableAge}
        onChange={handleChange}
        placeholder="Enter Suitable Age"
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default AgeInput
