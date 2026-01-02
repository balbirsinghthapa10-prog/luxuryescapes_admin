import React from "react"
import { Plus, X, Star } from "lucide-react"

interface Highlight {
  id: string
  text: string
}

interface HighlightsBannerProps {
  highlights: Highlight[]
  onHighlightsChange: (highlights: Highlight[]) => void
  maxHighlights?: number
}

const HighlightsInputBanner: React.FC<HighlightsBannerProps> = ({
  highlights,
  onHighlightsChange,
  maxHighlights = 10,
}) => {
  const addHighlight = () => {
    if (highlights.length >= maxHighlights) return

    const newHighlight: Highlight = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
    }

    onHighlightsChange([...highlights, newHighlight])
  }

  const removeHighlight = (id: string) => {
    if (highlights.length <= 1) return // Keep at least one highlight

    const updatedHighlights = highlights.filter(
      (highlight) => highlight.id !== id
    )
    onHighlightsChange(updatedHighlights)
  }

  const updateHighlight = (id: string, text: string) => {
    const updatedHighlights = highlights.map((highlight) =>
      highlight.id === id ? { ...highlight, text } : highlight
    )
    onHighlightsChange(updatedHighlights)
  }

  // Initialize with one empty highlight if none exist
  React.useEffect(() => {
    if (highlights.length === 0) {
      addHighlight()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <Star className="inline w-4 h-4 mr-1 text-yellow-500" />
          Highlights
        </label>
        <span className="text-xs text-gray-500">
          {highlights.length}/{maxHighlights}
        </span>
      </div>

      <div className="space-y-3">
        {highlights.map((highlight, index) => (
          <div key={highlight.id} className="flex items-start space-x-3 group">
            {/* Index Number */}
            <div className="flex-shrink-0 w-8 h-10 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center mt-0.5">
              <span className="text-sm font-medium text-blue-600">
                {index + 1}
              </span>
            </div>

            {/* Input Field */}
            <div className="flex-1">
              <input
                type="text"
                value={highlight.text}
                onChange={(e) => updateHighlight(highlight.id, e.target.value)}
                placeholder={`Enter highlight ${index + 1}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                maxLength={200}
              />
              {highlight.text.length > 150 && (
                <p className="text-xs text-orange-500 mt-1">
                  {200 - highlight.text.length} characters remaining
                </p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeHighlight(highlight.id)}
              disabled={highlights.length <= 1}
              className={`flex-shrink-0 p-2 rounded-md transition-all ${
                highlights.length <= 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100"
              }`}
              aria-label="Remove highlight"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Highlight Button */}
      <button
        onClick={addHighlight}
        disabled={highlights.length >= maxHighlights}
        className={`w-full py-2 px-4 border-2 border-dashed rounded-md transition-all flex items-center justify-center space-x-2 ${
          highlights.length >= maxHighlights
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">
          {highlights.length >= maxHighlights
            ? `Maximum ${maxHighlights} highlights reached`
            : "Add New Highlight"}
        </span>
      </button>

      {/* Summary */}
      {highlights.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total highlights: {highlights.filter((h) => h.text.trim()).length}{" "}
              of {highlights.length}
            </span>
            {highlights.some((h) => !h.text.trim()) && (
              <span className="text-orange-600 text-xs">
                Some highlights are empty
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HighlightsInputBanner
