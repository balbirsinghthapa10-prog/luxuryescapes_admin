import React from "react"
import { Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedFile: File | null
  preview: string | null
  uploadedUrl?: string
}

const ImageUploadBanner: React.FC<ImageUploadProps> = ({
  onFileSelect,
  selectedFile,
  preview,
  uploadedUrl,
}) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-700">
      Upload Image
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
      <input
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
      </label>
    </div>
    {selectedFile && (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="text-sm text-green-700">Selected: {selectedFile.name}</p>
      </div>
    )}
    {preview && (
      <div className="mt-3">
        <h1>New Image Preview</h1>
        <Image
          src={preview}
          alt="Preview"
          className="max-w-full h-48 object-cover rounded-md border"
          width={300}
          height={200}
          loading="lazy"
        />
      </div>
    )}
    {uploadedUrl && (
      <div className="mt-3">
        <h1>Current Image</h1>
        <Image
          src={uploadedUrl}
          alt="Current Image Preview"
          className="max-w-full h-48 object-cover rounded-md border"
          width={300}
          height={200}
          loading="lazy"
        />
      </div>
    )}
  </div>
)

export default ImageUploadBanner
