import React from "react"
import { Input } from "../ui/input"

interface TitleInputProps {
  price: number
  setPrice: React.Dispatch<React.SetStateAction<number>>
  error: string
}

const PriceInput: React.FC<TitleInputProps> = ({ price, setPrice, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value))
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Price ($) <span className="text-gray-700">(optional)</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="number"
        value={price}
        onChange={handleChange}
        placeholder="Enter Price"
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default PriceInput
