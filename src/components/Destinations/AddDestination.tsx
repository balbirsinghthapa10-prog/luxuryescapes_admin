// "use client"

// import React, { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Upload } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import axios from "axios"
// import Image from "next/image"
// import { Input } from "../ui/input"

// const AddDestination = () => {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     image: null as File | null,
//   })

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]

//     if (!file) return

//     // For preview
//     const reader = new FileReader()
//     reader.onload = () => {
//       setImagePreview(reader.result as string)
//     }
//     reader.readAsDataURL(file)

//     // Store the file object itself in the formData
//     setFormData((prev) => ({
//       ...prev,
//       image: file, // Store the actual file object for submission
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.title || !formData.description) {
//       toast.error("Please fill all required fields")
//       return
//     }

//     setLoading(true)

//     try {
//       // Create a FormData object to send binary data
//       const formDataToSend = new FormData()
//       formDataToSend.append("title", formData.title)
//       formDataToSend.append("description", formData.description)

//       // Append the file if it exists and is a File object
//       if (formData.image instanceof File) {
//         formDataToSend.append("image", formData.image)
//       }

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/add`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Important for binary file uploads
//           },
//         }
//       )

//       if (response.data.success) {
//         toast.success("Destination created successfully")
//         router.push("/destinations")
//       } else {
//         toast.error(response.data.message || "Failed to create destination")
//       }
//     } catch (error) {
//       console.error("Error creating destination:", error)
//       toast.error("Something went wrong. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen w-full">
//       {/* Header Section */}
//       <div className="flex gap-10 items-center text-center mb-8">
//         <ArrowLeft
//           className="w-10 h-10 cursor-pointer"
//           onClick={() => router.back()}
//         />
//         <h1 className="text-5xl font-serif text-primary">
//           Create New Destination
//         </h1>
//       </div>

//       {/* Form Section */}
//       <Card className="p-8 max-w-4xl mx-auto">
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-6">
//             {/* Image Upload */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-2">
//                 Destination Image
//               </label>
//               <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                 {imagePreview ? (
//                   <div className="relative w-full h-64">
//                     <Image
//                       src={imagePreview}
//                       alt="Preview"
//                       layout="fill"
//                       objectFit="cover"
//                       className="rounded-lg"
//                     />
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       className="absolute top-2 right-2"
//                       onClick={() => setImagePreview(null)}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                     <div className="mt-2 flex flex-col items-center">
//                       <label
//                         htmlFor="image-upload"
//                         className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100"
//                       >
//                         <span>Upload an image</span>
//                         <Input
//                           id="image-upload"
//                           name="image"
//                           type="file"
//                           accept="image/*"
//                           className="sr-only"
//                           onChange={handleImageChange}
//                         />
//                       </label>
//                       <p className="mt-1 text-xs text-gray-500">
//                         PNG, JPG, GIF up to 10MB
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-2">
//                 Destination Title
//               </label>
//               <Input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//                 placeholder="Enter destination title"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-2">
//                 Destination Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={6}
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//                 placeholder="Enter destination description"
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end mt-8">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="mr-4"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-primary hover:bg-primary/90"
//                 disabled={loading}
//               >
//                 {loading ? "Creating..." : "Create Destination"}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </Card>
//     </div>
//   )
// }

// export default AddDestination

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

const AddDestination = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null as File | null,
    destinationImages: [] as { file: File; caption: string; preview: string }[],
  })

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
      destinationImages: [
        ...prev.destinationImages,
        { file: null as unknown as File, caption: "", preview: "" },
      ],
    }))
  }

  const handleRemoveImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      destinationImages: prev.destinationImages.filter((_, i) => i !== index),
    }))
  }

  const handleDestinationImageChange = (
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
        destinationImages: prev.destinationImages.map((item, i) =>
          i === index ? { ...item, file, preview } : item
        ),
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleCaptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      destinationImages: prev.destinationImages.map((item, i) =>
        i === index ? { ...item, caption: value } : item
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.thumbnail) {
      toast.error("Please fill all required fields and upload a thumbnail")
      return
    }

    // Validate that all destination images have captions and files
    const invalidImages = formData.destinationImages.some(
      (img) => (img.file && !img.caption) || (!img.file && img.caption)
    )

    if (invalidImages) {
      toast.error(
        "Please provide both image and caption for all destination images"
      )
      return
    }

    setLoading(true)

    try {
      // Create a FormData object to send binary data
      const formDataToSend = new FormData()

      // Add basic text fields
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)

      // Add thumbnail
      if (formData.thumbnail instanceof File) {
        formDataToSend.append("thumbnail", formData.thumbnail)
      }

      // Add destination images
      formData.destinationImages
        .filter((item) => item.file && item.caption)
        .forEach((item) => {
          formDataToSend.append("image", item.file)
        })

      // Add captions for destination images as an array
      const captions = formData.destinationImages
        .filter((item) => item.file && item.caption)
        .map((item) => item.caption)

      // Only add captions if there are any
      if (captions.length > 0) {
        formDataToSend.append("caption", JSON.stringify(captions))
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/add-dest`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        toast.success("Destination created successfully")
        router.push("/destinations")
      } else {
        toast.error(response.data.message || "Failed to create destination")
      }
    } catch (error) {
      console.error("Error creating destination:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="flex gap-4 md:gap-10 items-center mb-6 md:mb-8">
        <div onClick={() => router.back()}>
          <ArrowLeft className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-primary">
          Create New Destination
        </h1>
      </div>

      {/* Form Section */}
      <Card className="p-4 md:p-8 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Text Fields */}
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

            {/* Right Column - Thumbnail */}
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

          {/* Destination Images Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800">
                Destination Images
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

            {formData.destinationImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.destinationImages.map((item, index) => (
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
                              onChange={(e) =>
                                handleDestinationImageChange(index, e)
                              }
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

                    <Label className="block text-sm font-medium text-gray-700 italic">
                      Image Caption
                    </Label>
                    <Input
                      type="text"
                      value={item.caption}
                      onChange={(e) => handleCaptionChange(index, e)}
                      className="w-full mt-2"
                      placeholder="Enter caption for this image"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-gray-500">
                  Click "Add Image" to include destination images
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
              {loading ? "Creating..." : "Create Destination"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddDestination
