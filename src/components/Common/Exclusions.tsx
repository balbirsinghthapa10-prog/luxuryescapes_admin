import React from "react"

interface AccommodationInputProps {
  exclusion: string[]
  setExclusion: React.Dispatch<React.SetStateAction<string[]>>
  error: string
}

const Exclusions: React.FC<AccommodationInputProps> = ({
  exclusion,
  setExclusion,
  error,
}) => {
  const handleAddInclusion = () => {
    setExclusion([...exclusion, ""])
  }

  const handleInclusionChange = (index: number, value: string) => {
    const updateInclusion = exclusion.map((exclusion, i) =>
      i === index ? value : exclusion
    )
    setExclusion(updateInclusion)
  }

  const handleRemoveInclusion = (index: number) => {
    const updateInclusion = exclusion.filter((_, i) => i !== index)
    setExclusion(updateInclusion)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Exclusion <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {exclusion.map((exclusion, index) => (
        <div key={index} className="mt-2 flex items-center space-x-4">
          <input
            type="text"
            value={exclusion}
            onChange={(e) => handleInclusionChange(index, e.target.value)}
            placeholder={`Exclusion #${index + 1}`}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          <button
            type="button"
            onClick={() => handleRemoveInclusion(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddInclusion}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New
      </button>
    </div>
  )
}

export default Exclusions
