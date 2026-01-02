import React from "react"

import { Textarea } from "../ui/textarea"

interface InputProps {
  overview: string
  setOverview: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const OverviewInput: React.FC<InputProps> = ({
  overview,
  setOverview,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOverview(e.target.value)
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Overview (min 10 words)<span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Textarea
        value={overview}
        onChange={handleChange}
        placeholder="Enter Overview "
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default OverviewInput
