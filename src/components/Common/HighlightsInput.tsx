//updated
import React, { useState, useEffect } from "react"
import { Camera, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HighlightType {
  highlightsTitle: string
}

interface HighlightsInputProps {
  highlights: HighlightType[]
  setHighlights: React.Dispatch<React.SetStateAction<HighlightType[]>>
  error: string
}

const HighlightsInput: React.FC<HighlightsInputProps> = ({
  highlights,
  setHighlights,
  error,
}) => {
  const updateHighlight = (
    index: number,
    updatedHighlight: Partial<HighlightType>
  ) => {
    const updatedHighlights = highlights.map((highlight, i) =>
      i === index ? { ...highlight, ...updatedHighlight } : highlight
    )
    setHighlights(updatedHighlights)
  }

  const addHighlight = () => {
    setHighlights([...highlights, { highlightsTitle: "" }])
  }

  const removeHighlight = (index: number) => {
    const updatedHighlights = highlights.filter((_, i) => i !== index)
    setHighlights(updatedHighlights)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Highlights:
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {highlights.map((highlight, index) => (
        <div
          key={index}
          className="mb-4 border p-4 rounded-md border-primary bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium">Highlight {index + 1}</h3>
            <Button
              type="button"
              onClick={() => removeHighlight(index)}
              variant="destructive"
              size="sm"
            >
              <Trash2 size={18} className="mr-2" />
              Remove
            </Button>
          </div>

          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="text-sm italic text-gray-400">
                Highlight Title
              </label>
              <Input
                type="text"
                required
                placeholder="Enter highlight title"
                value={highlight.highlightsTitle || ""} // Add fallback empty string
                onChange={(e) =>
                  updateHighlight(index, {
                    highlightsTitle: e.target.value,
                  })
                }
                className="w-full bg-white border border-primary"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addHighlight}
        className="mt-4 flex items-center text-white"
      >
        <Camera size={18} className="mr-2" />
        Add Highlight
      </Button>
    </div>
  )
}

export default HighlightsInput
