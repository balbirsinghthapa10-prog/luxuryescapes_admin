import React from "react"

interface PageNameInputProps {
  value: string
  onChange: (value: string) => void
}

const PageNameInputBanner: React.FC<PageNameInputProps> = ({
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Page Name</label>
    <span className="text-xs text-gray-500">
      Select the page where this banner will be displayed. <br />
      (Note: Only one page can be selected for one banner.)
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select page type</option>
      <option value="home">Home</option>
      <option value="tours">Luxury Tours</option>
      <option value="explore-nepal">Explore Nepal</option>
      <option value="luxury-treks">Luxury Treks</option>
      <option value="accommodations">Hotel/Resort</option>
      <option value="fine-dinings">Fine Dining</option>
    </select>
  </div>
)

export default PageNameInputBanner
