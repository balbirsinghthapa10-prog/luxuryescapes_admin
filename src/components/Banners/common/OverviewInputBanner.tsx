import React from "react"

interface InputProps {
  value: string
  onChange: (value: string) => void
}

const OverviewInputBanner: React.FC<InputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Banner Overview
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter banner description"
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
    />
  </div>
)

export default OverviewInputBanner
