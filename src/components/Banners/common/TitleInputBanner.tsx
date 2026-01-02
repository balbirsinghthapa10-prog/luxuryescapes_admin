import React from "react"

interface TitleInputProps {
  value: string
  onChange: (value: string) => void
}

const TitleInputBanner: React.FC<TitleInputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Banner Title
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter banner title"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
)

export default TitleInputBanner
