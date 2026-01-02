import React from "react"
import ReactPlayer from "react-player"
import { Upload, Link as LinkIcon, Video as VideoIcon } from "lucide-react"

interface VideoUploadProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUrlChange: (value: string) => void
  selectedFile: File | null
  videoUrl: string
  uploadMethod: "upload" | "url"
  setUploadMethod: (method: "upload" | "url") => void
  existingVideoUrl?: string // Optional prop for existing video URL
}

const VideoUploadBanner: React.FC<VideoUploadProps> = ({
  onFileSelect,
  onUrlChange,
  selectedFile,
  videoUrl,
  uploadMethod,
  setUploadMethod,
  existingVideoUrl = "",
}) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700">Add Video</label>

    {/* Upload Method Selection */}
    <div className="flex space-x-4">
      {/* <label className="flex items-center">
        <input
          type="radio"
          name="videoMethod"
          value="upload"
          checked={uploadMethod === "upload"}
          onChange={(e) => setUploadMethod(e.target.value as "upload")}
          className="mr-2"
        />
        <Upload className="w-4 h-4 mr-1" />
        Upload File
      </label> */}
      <label className="flex items-center">
        <input
          type="radio"
          name="videoMethod"
          value="url"
          checked={uploadMethod === "url"}
          onChange={(e) => setUploadMethod(e.target.value as "url")}
          className="mr-2"
        />
        <LinkIcon className="w-4 h-4 mr-1" />
        Video URL
      </label>
    </div>

    {uploadMethod === "upload" && (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="video/*"
          onChange={onFileSelect}
          className="hidden"
          id="video-upload"
        />
        <label htmlFor="video-upload" className="cursor-pointer">
          <VideoIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">Click to upload video file</p>
          <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to 20MB</p>
        </label>
        {selectedFile && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              Selected: {selectedFile.name}
            </p>
          </div>
        )}
      </div>
    )}

    {uploadMethod === "url" && (
      <div>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    )}
    {existingVideoUrl && (
      <div className="mt-3">
        <h1 className="text-sm font-medium text-gray-700">Current Video</h1>
        <ReactPlayer
          src={existingVideoUrl}
          className="rounded-lg shadow-sm object-cover w-200 h-150"
          controls
          // autoPlay={true}
          loop={true}
          // muted={true}
          light={true}
          width={128}
          height={96}
        />
      </div>
    )}
  </div>
)

export default VideoUploadBanner
