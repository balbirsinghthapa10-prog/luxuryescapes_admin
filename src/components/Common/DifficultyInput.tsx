import React from "react"

interface InputProps {
  difficulty: string
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const DifficultyInput: React.FC<InputProps> = ({
  difficulty,
  setDifficulty,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Difficulty <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <select
        value={difficulty}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      >
        <option value="">Select a difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  )
}

export default DifficultyInput
