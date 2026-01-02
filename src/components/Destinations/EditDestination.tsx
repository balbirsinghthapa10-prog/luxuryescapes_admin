"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"
import MainSpinner from "@/utils/MainLoader"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

interface EditDestinationProps {
  params: {
    id: string
  }
}

interface DestinationImage {
  caption: string
  image: string
}

const EditDestination: React.FC<EditDestinationProps> = ({ params }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    thumbnail: null as File | null,
    thumbnailUrl: "",
    destinations: [] as DestinationImage[],
    newImages: [] as { file: File; caption: string; preview: string }[],
    removeCaptions: [] as string[],
  })

  useEffect(() => {
    const fetchDestination = async () => {
      setPageLoading(true)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/get/${params.id}`
        )

        if (response.data.success) {
          const destination = response.data.data
          setFormData({
            _id: destination._id,
            title: destination.title,
            description: destination.description,
            thumbnail: null,
            thumbnailUrl: destination.thumbnail,
            destinations: destination.destinations || [],
            newImages: [],
            removeCaptions: [],
          })

          if (destination.thumbnail) {
            setThumbnailPreview(destination.thumbnail)
          }
        } else {
          toast.error("Failed to fetch destination details")
          router.push("/destinations")
        }
      } catch (error) {
        console.error("Error fetching destination:", error)
        toast.error("Something went wrong. Please try again.")
        router.push("/destinations")
      } finally {
        setPageLoading(false)
      }
    }

    fetchDestination()
  }, [params.id, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For preview
    const reader = new FileReader()
    reader.onload = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Store the file object itself in the formData
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
    }))
  }

  const handleAddImageField = () => {
    setFormData((prev) => ({
      ...prev,
      newImages: [
        ...prev.newImages,
        { file: null as unknown as File, caption: "", preview: "" },
      ],
    }))
  }

  const handleRemoveImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }))
  }

  const handleRemoveExistingImage = (index: number) => {
    const captionToRemove = formData.destinations[index].caption

    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
      removeCaptions: [...prev.removeCaptions, captionToRemove],
    }))
  }

  const handleNewImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview for the image
    const reader = new FileReader()
    reader.onload = () => {
      const preview = reader.result as string
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.map((item, i) =>
          i === index ? { ...item, file, preview } : item
        ),
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleNewCaptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.map((item, i) =>
        i === index ? { ...item, caption: value } : item
      ),
    }))
  }

  const handleExistingCaptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.map((item, i) =>
        i === index ? { ...item, caption: value } : item
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      toast.error("Please fill all required fields")
      return
    }

    // Validate that all new images have captions and files
    const invalidNewImages = formData.newImages.some(
      (img) => (img.file && !img.caption) || (!img.file && img.caption)
    )

    if (invalidNewImages) {
      toast.error("Please provide both image and caption for all new images")
      return
    }

    setLoading(true)

    try {
      // Create a FormData object to send binary data
      const formDataToSend = new FormData()

      // Add basic text fields
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)

      // Add thumbnail if changed
      if (formData.thumbnail instanceof File) {
        formDataToSend.append("thumbnail", formData.thumbnail)
      }

      // Add image files for new images
      formData.newImages
        .filter((item) => item.file && item.caption)
        .forEach((item) => {
          formDataToSend.append("image", item.file)
        })

      let captionsToRemove: string[] = []

      // Add captions to be removed as an array
      if (formData.removeCaptions.length > 0) {
        formData.removeCaptions.forEach((caption) => {
          captionsToRemove.push(caption)
        })
      }

      if (captionsToRemove.length > 0) {
        formDataToSend.append(
          "removeCaptions",
          JSON.stringify(captionsToRemove)
        )
      }

      let captions: string[] = []

      // // Add any updated captions for existing images
      // const updatedCaptions = formData.destinations.map((dest) => dest.caption)
      // if (updatedCaptions.length > 0) {
      //   updatedCaptions.forEach((caption) => {
      //     captions.push(caption)
      //   })
      // }

      // Add captions for new images as an array
      const newCaptions = formData.newImages
        .filter((item) => item.file && item.caption)
        .map((item) => item.caption)

      // Only add captions if there are any
      if (newCaptions.length > 0) {
        newCaptions.forEach((caption) => {
          captions.push(caption)
        })
      }

      if (captions.length > 0) {
        formDataToSend.append("caption", JSON.stringify(captions))
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/edit/${formData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        toast.success("Destination updated successfully")
        router.push("/destinations")
      } else {
        toast.error(response.data.message || "Failed to update destination")
      }
    } catch (error) {
      console.error("Error updating destination:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MainSpinner />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="flex gap-4 md:gap-10 items-center mb-6 md:mb-8">
        <div onClick={() => router.back()}>
          <ArrowLeft className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-primary">
          Edit Destination
        </h1>
      </div>

      {/* Form Section */}
      <Card className="p-4 md:p-8 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Right Column - Text Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Destination Title
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter destination title"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  placeholder="Enter destination description"
                  required
                />
              </div>
            </div>
            {/* right Column - Thumbnail */}
            <div className="w-80">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Main Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                {thumbnailPreview ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setThumbnailPreview(null)
                        setFormData((prev) => ({
                          ...prev,
                          thumbnail: null,
                          thumbnailUrl: "",
                        }))
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="mt-2">
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100"
                      >
                        <span>Upload thumbnail</span>
                        <Input
                          id="thumbnail-upload"
                          name="thumbnail"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Existing Destination Images Section */}
          {formData.destinations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-medium text-gray-800 mb-4">
                Existing Destination Images
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Removed images will be deleted permanently)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {formData.destinations.map((destination, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="relative w-full h-48 mb-3">
                      <Image
                        src={destination.image}
                        alt={destination.caption}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Label className="block text-sm font-medium text-gray-700 italic">
                      Image Caption
                    </Label>
                    <Input
                      type="text"
                      value={destination.caption}
                      onChange={(e) => handleExistingCaptionChange(index, e)}
                      className="w-full mt-2"
                      placeholder="Image caption"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800">
                Add New Images
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Both image and caption are required)
                </span>
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddImageField}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Image
              </Button>
            </div>

            {formData.newImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.newImages.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="relative w-full h-48 mb-3">
                      {item.preview ? (
                        <Image
                          src={item.preview}
                          alt="Preview"
                          fill
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="cursor-pointer text-center"
                          >
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Click to upload image
                            </span>
                            <Input
                              id={`image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => handleNewImageChange(index, e)}
                            />
                          </label>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImageField(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      type="text"
                      value={item.caption}
                      onChange={(e) => handleNewCaptionChange(index, e)}
                      className="w-full mt-2"
                      placeholder="Enter caption for this image"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-gray-500">
                  Click "Add Image" to include additional destination images
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Destination"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default EditDestination
