import React from "react"

import { Textarea } from "../ui/textarea"

interface InputProps {
  note: string
  setNote: React.Dispatch<React.SetStateAction<string>>
}

const NoteInput: React.FC<InputProps> = ({ note, setNote }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value as string)
  }
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">Note</label>

      <Textarea
        value={note}
        onChange={handleChange}
        placeholder="Add any additional notes here..."
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  )
}

export default NoteInput
