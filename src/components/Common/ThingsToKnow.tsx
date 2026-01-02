import React from "react"

interface AccommodationInputProps {
  thingsToKnow: string[]
  setThingsToKnow: React.Dispatch<React.SetStateAction<string[]>>
  error: string
}

const ThingsToKnowInput: React.FC<AccommodationInputProps> = ({
  thingsToKnow,
  setThingsToKnow,
  error,
}) => {
  const handleAddAccommodation = () => {
    setThingsToKnow([...thingsToKnow, ""])
  }

  const handleThingsToKnowChange = (index: number, value: string) => {
    const updateThingsToKnow = thingsToKnow.map((accommodation, i) =>
      i === index ? value : accommodation
    )
    setThingsToKnow(updateThingsToKnow)
  }

  const handleRemoveThingsToKnow = (index: number) => {
    const updateThingsToKnow = thingsToKnow.filter((_, i) => i !== index)
    setThingsToKnow(updateThingsToKnow)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Things To Know <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {thingsToKnow.map((accommodation, index) => (
        <div key={index} className="mt-2 flex items-center space-x-4">
          <input
            type="text"
            value={accommodation}
            onChange={(e) => handleThingsToKnowChange(index, e.target.value)}
            placeholder={`Accommodation #${index + 1}`}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          <button
            type="button"
            onClick={() => handleRemoveThingsToKnow(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddAccommodation}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New
      </button>
    </div>
  )
}

export default ThingsToKnowInput
