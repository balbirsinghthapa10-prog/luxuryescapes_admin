import React from "react"

interface AccommodationInputProps {
  accommodations: string[]
  setAccommodations: React.Dispatch<React.SetStateAction<string[]>>
  error: string
}

const AccommodationInput: React.FC<AccommodationInputProps> = ({
  accommodations,
  setAccommodations,
  error,
}) => {
  const handleAddAccommodation = () => {
    setAccommodations([...accommodations, ""])
  }

  const handleAccommodationChange = (index: number, value: string) => {
    const updatedAccommodations = accommodations.map((accommodation, i) =>
      i === index ? value : accommodation
    )
    setAccommodations(updatedAccommodations)
  }

  const handleRemoveAccommodation = (index: number) => {
    const updatedAccommodations = accommodations.filter((_, i) => i !== index)
    setAccommodations(updatedAccommodations)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Accommodations <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {accommodations.map((accommodation, index) => (
        <div key={index} className="mt-2 flex items-center space-x-4">
          <input
            type="text"
            value={accommodation}
            onChange={(e) => handleAccommodationChange(index, e.target.value)}
            placeholder={`Accommodation #${index + 1}`}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          <button
            type="button"
            onClick={() => handleRemoveAccommodation(index)}
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

export default AccommodationInput
