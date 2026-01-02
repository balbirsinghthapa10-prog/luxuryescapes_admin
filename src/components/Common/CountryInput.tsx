import React from "react"

interface InputProps {
  country: string
  setCountry: React.Dispatch<React.SetStateAction<string>>
  error: string
}

const CountryInput: React.FC<InputProps> = ({ country, setCountry, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Country <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <select
        value={country}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      >
        <option value="">Select a country</option>
        <option value="Nepal">Nepal</option>
        <option value="Bhutan">Bhutan</option>
        <option value="Tibet">Tibet</option>
        <option value="Multidestinations">Multi-destinations</option>
      </select>
    </div>
  )
}

export default CountryInput
