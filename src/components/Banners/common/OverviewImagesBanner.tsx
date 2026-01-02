import React from "react"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageData {
  id: string
  file?: File
  preview?: string
  uploadedUrl?: string
  name: string
}

interface OverviewImagesBannerProps {
  onFilesSelect: (files: FileList) => void
  images: ImageData[]
  onRemoveImage: (id: string) => void
}

const OverviewImagesBanner: React.FC<OverviewImagesBannerProps> = ({
  onFilesSelect,
  images,
  onRemoveImage,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(e.target.files)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Overview Images (multiple)
      </label>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="images-upload"
          multiple
        />
        <label htmlFor="images-upload" className="cursor-pointer">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">
            Click to upload or drag and drop multiple images
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF up to 10MB each
          </p>
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Selected Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveImage(image.id)}
                  className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Image */}
                <div className="aspect-video relative">
                  <Image
                    src={image.preview || image.uploadedUrl || ""}
                    alt={`Image: ${image.name}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Image Info */}
                <div className="p-3">
                  <p className="text-sm text-gray-900 truncate font-medium">
                    {image.name}
                  </p>
                  {image.file && (
                    <p className="text-xs text-gray-500 mt-1">
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No images selected</p>
        </div>
      )}
    </div>
  )
}

export default OverviewImagesBanner
