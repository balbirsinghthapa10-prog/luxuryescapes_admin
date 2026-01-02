"use client"
import React, { useEffect, useState } from "react"
import { Save, ChevronLeft } from "lucide-react"

import TitleInputBanner from "./common/TitleInputBanner"
import DescriptionInputBanner from "./common/DescriptionInputBanner"
import ImageUploadBanner from "./common/ImageUploadBanner"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import { DestinationBannerTypes } from "../Types/Types"
import OverviewInputBanner from "./common/OverviewInputBanner"
import OverviewImagesBanner from "./common/OverviewImagesBanner"
import HighlightsInputBanner from "./common/HighlightsInputBanner"

interface ImageData {
  id: string
  file: File
  preview: string
  name: string
}

interface Highlight {
  id: string
  text: string
}

const AddDestinationBanner: React.FC = () => {
  const [formData, setFormData] = useState<DestinationBannerTypes>({
    title: "",
    description: "",
    image: null,
    overview: "",
    overviewImages: [],
    highlights: [],
  })

  const [overviewImages, setOverviewImages] = useState<ImageData[]>([])

  const router = useRouter()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  //  handler for multiple files selection
  const handleOverviewImagesSelect = (files: FileList) => {
    const newImages = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setOverviewImages((prev) => [...prev, ...newImages])

    // Update formData with File objects
    setFormData((prev) => ({
      ...prev,
      overviewImages: [
        ...prev.overviewImages,
        ...newImages.map((img) => img.file),
      ],
    }))
  }

  //  handler for removing images
  const handleRemoveOverviewImage = (id: string) => {
    setOverviewImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        // Revoke the blob URL to prevent memory leaks
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })

    // Update formData
    setFormData((prev) => ({
      ...prev,
      overviewImages: overviewImages
        .filter((img) => img.id !== id)
        .map((img) => img.file),
    }))
  }

  //  handler for highlights change
  const handleHighlightsChange = (highlights: Highlight[]) => {
    setFormData((prev) => ({
      ...prev,
      highlights: highlights,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("title", formData.title)
      formDataToSubmit.append("description", formData.description)
      if (formData.image) {
        formDataToSubmit.append("image", formData.image)
      }
      formDataToSubmit.append("overview", formData.overview)
      formData.overviewImages.forEach((file, index) => {
        formDataToSubmit.append(`overviewImages`, file)
      })
      if (formData.highlights && formData.highlights.length > 0) {
        const highlightTexts = formData.highlights
          .filter((h) => h.text.trim()) // Filter out empty highlights
          .map((h) => h.text.trim())

        formDataToSubmit.append("highlights", JSON.stringify(highlightTexts))
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/add`,
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
        router.push("/destination-banners")
      }
      setFormData({
        title: "",
        description: "",
        image: null,
        overview: "",
        overviewImages: [],
        highlights: [],
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
    !!formData.description &&
    !!formData.image &&
    !!formData.overview &&
    !!formData.highlights &&
    formData.overviewImages.length > 0 &&
    formData.highlights.length > 0 &&
    formData.highlights.every((h) => h.text.trim())

  useEffect(() => {
    // Cleanup function to revoke blob URLs when component unmounts
    return () => {
      overviewImages.forEach((image) => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [overviewImages])

  return (
    <div className=" mx-auto p-6 ">
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

            <DescriptionInputBanner
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
            />
            <OverviewInputBanner
              value={formData.overview}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, overview: value }))
              }
            />

            <ImageUploadBanner
              onFileSelect={handleImageSelect}
              selectedFile={formData.image}
              preview={imagePreview}
            />

            <OverviewImagesBanner
              onFilesSelect={handleOverviewImagesSelect}
              images={overviewImages}
              onRemoveImage={handleRemoveOverviewImage}
            />

            <HighlightsInputBanner
              highlights={formData.highlights}
              onHighlightsChange={handleHighlightsChange}
              maxHighlights={8} // Optional: Limit to 8 highlights
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSubmit}
            // disabled={!isFormValid || loading}
            disabled={loading}
            className={`px-6 py-3 rounded-md font-medium flex items-center space-x-2 ${
              !loading // isFormValid
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

export default AddDestinationBanner
