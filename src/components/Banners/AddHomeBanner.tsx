"use client"
import React, { useState } from "react"
import {
  Upload,
  Video,
  Image,
  Link,
  Save,
  Eye,
  ChevronLeft,
} from "lucide-react"

import TitleInputBanner from "./common/TitleInputBanner"
import PageNameInputBanner from "./common/PageNameInputBanner"
import DescriptionInputBanner from "./common/DescriptionInputBanner"
import BannerTypeSelector from "./common/BannerTypeSelector"
import ImageUploadBanner from "./common/ImageUploadBanner"
import VideoUploadBanner from "./common/VideoUploadBanner"
import PreviewSection from "./common/PreviewBanner"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"

type BannerType = "image" | "video" | ""

interface BannerFormData {
  title: string
  pageName: string
  description: string
  type: BannerType
  imageFile: File | null
  videoFile: File | null
  videoUrl: string
  videoUploadMethod: "upload" | "url"
}

const AddHomeBanner: React.FC = () => {
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    pageName: "",
    description: "",
    type: "",
    imageFile: null,
    videoFile: null,
    videoUrl: "",
    videoUploadMethod: "url",
  })

  const router = useRouter()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }))

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, videoFile: file, videoUrl: "" }))
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("title", formData.title)
      formDataToSubmit.append("pageName", formData.pageName)
      formDataToSubmit.append("description", formData.description)
      formDataToSubmit.append("type", formData.type)

      if (formData.type === "image" && formData.imageFile) {
        formDataToSubmit.append("image", formData.imageFile)
      } else if (formData.type === "video") {
        if (formData.videoFile) {
          formDataToSubmit.append("videoFile", formData.videoFile)
        } else if (formData.videoUrl) {
          formDataToSubmit.append("videoLink", formData.videoUrl)
        }
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/banner/add-banner`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const data = response.data
      if (data.success) {
        toast.success(data.message || "Banner saved successfully!")
      }
      setFormData({
        title: "",
        pageName: "",
        description: "",
        type: "",
        imageFile: null,
        videoFile: null,
        videoUrl: "",
        videoUploadMethod: "upload",
      })
      setImagePreview(null)
    } catch (error: any) {
      console.error("Error submitting banner data:", error)
      toast.error(error?.response?.data?.message || "Failed to save banner")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    !!formData.title &&
    !!formData.pageName &&
    !!formData.type &&
    !!formData.description &&
    ((formData.type === "image" && !!formData.imageFile) ||
      (formData.type === "video" &&
        (!!formData.videoFile || !!formData.videoUrl)))

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <div className="mb-8">
        <h1 className="flex gap-4 items-center text-3xl font-bold text-gray-900 mb-2">
          <ChevronLeft
            onClick={() => router.back()}
            className="cursor-pointer w-7 h-7"
          />
          Add Home Banner
        </h1>
        <p className="text-gray-600">
          Create and configure a new banner for your website
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <TitleInputBanner
              value={formData.title}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, title: value }))
              }
            />

            <PageNameInputBanner
              value={formData.pageName}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, pageName: value }))
              }
            />

            <DescriptionInputBanner
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
            />

            <BannerTypeSelector
              value={formData.type}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as BannerType }))
              }
            />

            {/* Conditional Banner Upload */}
            {formData.type === "image" && (
              <ImageUploadBanner
                onFileSelect={handleImageSelect}
                selectedFile={formData.imageFile}
                preview={imagePreview}
              />
            )}

            {formData.type === "video" && (
              <VideoUploadBanner
                onFileSelect={handleVideoFileSelect}
                onUrlChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    videoUrl: url,
                    videoFile: null,
                  }))
                }
                selectedFile={formData.videoFile}
                videoUrl={formData.videoUrl}
                uploadMethod={formData.videoUploadMethod}
                setUploadMethod={(method) =>
                  setFormData((prev) => ({
                    ...prev,
                    videoUploadMethod: method,
                  }))
                }
              />
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PreviewSection formData={formData} imagePreview={imagePreview} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className={`px-6 py-3 rounded-md font-medium flex items-center space-x-2 ${
              isFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            <Save className="w-5 h-5" />
            <span>{loading ? "Uploading..." : "Upload"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddHomeBanner
