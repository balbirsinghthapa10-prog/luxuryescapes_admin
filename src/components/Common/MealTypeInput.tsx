import React from "react"

interface InputProps {
  mealType: string
  setMealType: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const MealTypeInput: React.FC<InputProps> = ({
  mealType,
  setMealType,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMealType(e.target.value)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Meal Type <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <select
        value={mealType}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      >
        <option value="">Select a Meal Type</option>
        <option value="included">Included</option>
        <option value="not-included">Not Included</option>
      </select>
    </div>
  )
}

export default MealTypeInput
