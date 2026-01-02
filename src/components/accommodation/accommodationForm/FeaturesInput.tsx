import React from "react"

interface FeatureInputProps {
  features: string[]
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>
  error: string
}

const FeatureInput: React.FC<FeatureInputProps> = ({
  features,
  setFeatures,
  error,
}) => {
  const handleAddFeature = () => {
    setFeatures([...features, ""])
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updateFeatures = features.map((feature, i) =>
      i === index ? value : feature
    )
    setFeatures(updateFeatures)
  }

  const handleRemoveFeature = (index: number) => {
    const updateFeatures = features.filter((_, i) => i !== index)
    setFeatures(updateFeatures)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Features <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {features.map((feature, index) => (
        <div key={index} className="mt-2 flex items-center space-x-4">
          <input
            type="text"
            value={feature}
            onChange={(e) => handleFeatureChange(index, e.target.value)}
            placeholder={`Feature ${index + 1}`}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          <button
            type="button"
            onClick={() => handleRemoveFeature(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddFeature}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New
      </button>
    </div>
  )
}

export default FeatureInput
