import React from "react"
import { Input } from "../ui/input"

interface TitleInputProps {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Title <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Enter title"
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default TitleInput
