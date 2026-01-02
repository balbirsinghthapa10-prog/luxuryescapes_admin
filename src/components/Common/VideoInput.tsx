"use client"

import React, { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface VideoUploadInputProps {
  video: File | null
  setVideo: React.Dispatch<React.SetStateAction<File | null>>
}

const VideoUploadInput: React.FC<VideoUploadInputProps> = ({
  video,
  setVideo,
}) => {
  const [preview, setPreview] = useState<string | null>(
    video ? URL.createObjectURL(video) : null
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setVideo(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  const handleRemove = () => {
    setVideo(null)
    setPreview(null)
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Upload Video
      </label>
      <Input
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
      {preview && (
        <div className="mt-4">
          <video
            controls
            src={preview}
            className="w-full max-w-md rounded-md border border-gray-300"
          />
          <Button
            type="button"
            onClick={handleRemove}
            variant="destructive"
            className="mt-2"
          >
            Remove Video
          </Button>
        </div>
      )}
    </div>
  )
}

export default VideoUploadInput
