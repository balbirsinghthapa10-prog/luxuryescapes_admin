"use client"
import React, { useState, useEffect } from "react"
import { Save, Eye, ChevronLeft, Loader2 } from "lucide-react"

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
  _id?: string
  title: string
  pageName: string
  description: string
  type: BannerType
  imageFile: File | null
  videoFile: File | null
  videoUrl: string
  videoUploadMethod: "upload" | "url"
  uploadedImageUrl?: string
  existingVideoUrl?: string
}

interface BannerData {
  _id?: string
  title: string
  pageName: string
  description: string
  banner?: string
  type: BannerType
  imageUrl?: string
  videoUrl?: string
  videoLink?: string
}

interface EditHomeBannerProps {
  bannerId?: string
}

const EditHomeBanner: React.FC<EditHomeBannerProps> = ({ bannerId }) => {
  const [formData, setFormData] = useState<BannerFormData>({
    _id: "",
    title: "",
    pageName: "",
    description: "",
    type: "",
    imageFile: null,
    videoFile: null,
    videoUrl: "",
    videoUploadMethod: "url",
    uploadedImageUrl: "",
    existingVideoUrl: "",
  })

  const router = useRouter()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  // Fetch banner data on component mount
  useEffect(() => {
    const fetchBannerData = async () => {
      if (!bannerId) {
        toast.error("Banner ID is required")
        router.back()
        return
      }

      try {
        setFetchingData(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/banner/get-banner/${bannerId}`
        )

        const data: BannerData = response.data.data || response.data

        if (data) {
          setFormData((prev) => ({
            ...prev,
            _id: data._id || "",
            title: data.title || "",
            pageName: data.pageName || "",
            description: data.description || "",
            type: data.type || "",
            uploadedImageUrl: data.banner || "",
            existingVideoUrl: data.type === "video" ? data.banner : "",
            videoUrl: data.videoLink || "",
            videoUploadMethod: "url",
          }))

          // Set image preview if it's an image banner
          if (data.type === "image" && data.imageUrl) {
            setImagePreview(data.imageUrl)
          }

          setInitialDataLoaded(true)
        }
      } catch (error: any) {
        console.error("Error fetching banner data:", error)
        toast.error(
          error?.response?.data?.message || "Failed to fetch banner data"
        )
        router.back()
      } finally {
        setFetchingData(false)
      }
    }

    fetchBannerData()
  }, [bannerId, router])

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

      if (formData.type === "image") {
        if (formData.imageFile) {
          // New image file selected
          formDataToSubmit.append("image", formData.imageFile)
        } else if (formData.uploadedImageUrl) {
          // Keep existing image
          formDataToSubmit.append("uploadedImageUrl", formData.uploadedImageUrl)
        }
      } else if (formData.type === "video") {
        if (formData.videoFile) {
          // New video file selected
          formDataToSubmit.append("videoFile", formData.videoFile)
        } else if (formData.existingVideoUrl) {
          // Keep existing video
          formDataToSubmit.append("existingVideoUrl", formData.existingVideoUrl)
        }
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/banner/edit-banner/${formData._id}`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const data = response.data
      if (data.success) {
        toast.success(data.message || "Banner updated successfully!")
        router.back()
      }
    } catch (error: any) {
      console.error("Error updating banner data:", error)
      toast.error(error?.response?.data?.message || "Failed to update banner")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    !!formData.title &&
    !!formData.pageName &&
    !!formData.type &&
    !!formData.description &&
    ((formData.type === "image" &&
      (!!formData.imageFile || !!formData.uploadedImageUrl)) ||
      (formData.type === "video" &&
        (!!formData.videoFile ||
          !!formData.videoUrl ||
          !!formData.existingVideoUrl)))

  // Show loading spinner while fetching data
  if (fetchingData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Loading banner data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <div className="mb-8">
        <h1 className="flex gap-4 items-center text-3xl font-bold text-gray-900 mb-2">
          <ChevronLeft
            onClick={() => router.back()}
            className="cursor-pointer w-7 h-7"
          />
          Edit Home Banner
        </h1>
        <p className="text-gray-600">
          Update and configure your existing banner
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
                uploadedUrl={formData.uploadedImageUrl}
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
                existingVideoUrl={formData.existingVideoUrl}
              />
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PreviewSection
              formData={formData}
              imagePreview={imagePreview}
              //   isEditMode={true}
            />
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
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{loading ? "Updating..." : "Update Banner"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditHomeBanner
