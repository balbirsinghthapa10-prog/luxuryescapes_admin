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
  file?: File
  preview: string
  name: string
  isExisting?: boolean // Flag to identify existing images from server
}

interface Highlight {
  id: string
  text: string
}

interface EditDestinationBannerProps {
  slug: string
}

const EditDestinationBanner: React.FC<EditDestinationBannerProps> = ({
  slug,
}) => {
  const [formData, setFormData] = useState<DestinationBannerTypes>({
    title: "",
    description: "",
    image: null,
    overview: "",
    overviewImages: [],
    highlights: [],
  })

  const [overviewImages, setOverviewImages] = useState<ImageData[]>([])
  const [bannerId, setBannerId] = useState<string>("")
  const [initialLoading, setInitialLoading] = useState(true)

  const router = useRouter()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch banner details on component mount
  useEffect(() => {
    const fetchBannerDetails = async () => {
      try {
        setInitialLoading(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/get-desc/${slug}`
        )

        const data = response.data
        if (data.success) {
          const banner = data.data || data.banner // Adjust based on your API response structure

          // Set form data
          setFormData({
            title: banner.title || "",
            description: banner.description || "",
            image: null, // Will be set as preview only
            overview: banner.overview || "",
            overviewImages: [], // Will be handled separately
            highlights: banner.highlights
              ? banner.highlights.map((text: string, index: number) => ({
                  id: `highlight-${index}`,
                  text: text,
                }))
              : [],
          })

          // Set banner ID for update
          setBannerId(banner._id || banner.id)

          // Set main image preview
          if (banner.image) {
            setImagePreview(banner.image)
          }

          // Set overview images
          if (banner.overviewImages && banner.overviewImages.length > 0) {
            const existingImages = banner.overviewImages.map(
              (imageUrl: string, index: number) => ({
                id: `existing-${index}`,
                preview: imageUrl,
                name: `Image ${index + 1}`,
                isExisting: true,
              })
            )
            setOverviewImages(existingImages)
          }
        }
      } catch (error: any) {
        console.error("Error fetching banner details:", error)
        toast.error(
          error?.response?.data?.message || "Failed to fetch banner details"
        )
        router.back() // Redirect back if banner not found
      } finally {
        setInitialLoading(false)
      }
    }

    if (slug) {
      fetchBannerDetails()
    }
  }, [slug, router])

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

  // Handler for multiple files selection
  const handleOverviewImagesSelect = (files: FileList) => {
    const newImages = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
    }))

    setOverviewImages((prev) => [...prev, ...newImages])

    // Update formData with File objects (only new files)
    setFormData((prev) => ({
      ...prev,
      overviewImages: [
        ...prev.overviewImages,
        ...newImages.map((img) => img.file as File),
      ],
    }))
  }

  // Handler for removing images
  const handleRemoveOverviewImage = (id: string) => {
    setOverviewImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove && imageToRemove.file) {
        // Revoke the blob URL to prevent memory leaks (only for new uploads)
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })

    // Update formData (only for new files)
    setFormData((prev) => ({
      ...prev,
      overviewImages: overviewImages
        .filter((img) => img.id !== id && img.file)
        .map((img) => img.file as File),
    }))
  }

  // Handler for highlights change
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
      formDataToSubmit.append("overview", formData.overview)

      // Only append new image if one was selected
      if (formData.image) {
        formDataToSubmit.append("image", formData.image)
      }

      // Only append new overview images (not existing ones)
      formData.overviewImages.forEach((file, index) => {
        formDataToSubmit.append(`overviewImages`, file)
      })

      // Handle existing images that should be kept
      const existingImages = overviewImages
        .filter((img) => img.isExisting)
        .map((img) => img.preview)

      if (existingImages.length > 0) {
        formDataToSubmit.append(
          "existingOverviewImages",
          JSON.stringify(existingImages)
        )
      }

      if (formData.highlights && formData.highlights.length > 0) {
        const highlightTexts = formData.highlights
          .filter((h) => h.text.trim()) // Filter out empty highlights
          .map((h) => h.text.trim())

        formDataToSubmit.append("highlights", JSON.stringify(highlightTexts))
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/edit-desc/${bannerId}`,
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
        router.back() // Redirect back after successful update
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
    !!formData.description &&
    !!formData.overview &&
    !!formData.highlights &&
    formData.highlights.length > 0 &&
    formData.highlights.every((h) => h.text.trim())

  useEffect(() => {
    // Cleanup function to revoke blob URLs when component unmounts
    return () => {
      overviewImages.forEach((image) => {
        if (image.file) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }
  }, [overviewImages])

  if (initialLoading) {
    return (
      <div className="mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading banner details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto p-6">
      <div className="mb-8">
        <h1 className="flex gap-4 items-center text-3xl font-bold text-gray-900 mb-2">
          <ChevronLeft
            onClick={() => router.back()}
            className="cursor-pointer w-7 h-7"
          />
          Edit Home Banner
        </h1>
        <p className="text-gray-600">Update and modify your existing banner</p>
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
            disabled={!isFormValid || loading}
            className={`px-6 py-3 rounded-md font-medium flex items-center space-x-2 ${
              isFormValid && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            <Save className="w-5 h-5" />
            <span>{loading ? "Updating..." : "Update Banner"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditDestinationBanner
