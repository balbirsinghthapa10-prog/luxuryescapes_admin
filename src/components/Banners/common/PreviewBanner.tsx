import React from "react"
import { Eye } from "lucide-react"

interface PreviewSectionProps {
  formData: {
    title?: string
    pageName?: string
    type?: "image" | "video" | ""
    description?: string
    videoFile?: File | null
    videoUrl?: string
  }
  imagePreview: string | null
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  formData,
  imagePreview,
}) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Eye className="w-5 h-5 mr-2" />
      Preview
    </h3>
    <div className="space-y-3">
      <div>
        <span className="font-medium">Title:</span>{" "}
        {formData.title || "No title"}
      </div>
      <div>
        <span className="font-medium">Page:</span>{" "}
        {formData.pageName || "No page selected"}
      </div>
      <div>
        <span className="font-medium">Type:</span>{" "}
        {formData.type || "No type selected"}
      </div>
      <div>
        <span className="font-medium">Description:</span>
        <p className="mt-1 text-gray-600">
          {formData.description || "No description"}
        </p>
      </div>

      {formData.type === "image" && imagePreview && (
        <div>
          <span className="font-medium">Banner Image:</span>
          <img
            src={imagePreview}
            alt="Banner preview"
            className="mt-2 max-w-full h-32 object-cover rounded"
          />
        </div>
      )}

      {formData.type === "video" &&
        (formData.videoFile || formData.videoUrl) && (
          <div>
            <span className="font-medium">Banner Video:</span>
            <p className="text-sm text-gray-600 mt-1">
              {formData.videoFile
                ? `File: ${formData.videoFile.name}`
                : `URL: ${formData.videoUrl}`}
            </p>
          </div>
        )}
    </div>
  </div>
)

export default PreviewSection
