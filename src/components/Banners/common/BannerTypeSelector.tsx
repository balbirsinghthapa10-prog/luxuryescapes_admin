import React from "react"

interface BannerTypeSelectorProps {
  value: string
  onChange: (value: string) => void
}

const BannerTypeSelector: React.FC<BannerTypeSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Banner Type
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select banner type</option>
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>
  </div>
)

export default BannerTypeSelector
