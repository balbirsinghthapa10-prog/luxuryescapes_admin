"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Editor as TinyMCEEditor } from "tinymce"
import { Editor } from "@tinymce/tinymce-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// UI Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// Icons
import {
  ImageUp,
  Save,
  Plus,
  X,
  Link,
  Loader,
  ArrowLeftIcon,
  Loader2Icon,
} from "lucide-react"
import { FaArrowLeft } from "react-icons/fa6"
import { set } from "zod"
import { Textarea } from "../ui/textarea"

// Types
interface BlogLink {
  key: string
  url: string
}

interface EditBlogFormProps {
  slug: string // Specify the type for slug
}

interface TripsTours {
  _id: string
  tourType: string
  thumbnail: string
  description: string
}

const EditBlogForm: React.FC<EditBlogFormProps> = ({ slug }) => {
  const [blogId, setBlogId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [links, setLinks] = useState<BlogLink[]>([{ key: "", url: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const route = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tripsTours, setTripsTours] = useState<TripsTours[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTourTypeId, setSelectedTourTypeId] = useState<string>("") // New state for selected tour type ID

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image must be smaller than 5MB")
          return
        }

        setImage(file)
        setImagePreview(URL.createObjectURL(file))
      }
    },
    []
  )

  const handleAddLink = () => {
    setLinks([...links, { key: "", url: "" }])
  }

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks.length > 0 ? newLinks : [{ key: "", url: "" }])
  }

  const handleLinkChange = (
    index: number,
    field: keyof BlogLink,
    value: string
  ) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const handleEditBlog = async () => {
    if (
      !title ||
      !description.replace(/<[^>]*>/g, "").trim() ||
      //   !image ||
      !selectedTourTypeId
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const validLinks = links.filter(
      (link) => link.key.trim() && link.url.trim()
    )

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("link", JSON.stringify(validLinks))
      formData.append("category", selectedTourTypeId)

      if (image) {
        formData.append("thumbnail", image as Blob)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/blog/edit/${blogId}`,
        {
          method: "PATCH",
          body: formData,
        }
      )

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        resetForm()
        route.push("/blogs")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to create blog post")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setImage(null)
    setImagePreview(null)
    setLinks([{ key: "", url: "" }])
    setSelectedTourTypeId("") // Reset selected tour type ID

    if (editorRef.current) {
      editorRef.current.setContent("")
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  //Fetch Blog details
  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/blog/get-specific-blog/${slug}`
      )
      if (response.data.success) {
        const blog = response.data.data
        setBlogId(blog._id)
        setTitle(blog.title)
        setDescription(blog.description)
        setImagePreview(blog.thumbnail)
        setLinks(blog.link)
        setSelectedTourTypeId(blog.category._id)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching blog details:", error)
      toast.error("Failed to fetch Blog details")
    }
  }

  // Fetch Trips and Tours
  const fetchTripsTours = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/get-all-tour-types`
      )
      if (response.data.success) {
        setTripsTours(response.data.allTourTypes)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching trips/tours:", error)
      toast.error("Failed to fetch Trips/Tours")
    }
  }

  useEffect(() => {
    fetchBlogDetails()
    fetchTripsTours()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex gap-10 items-center text-center mb-8">
          <ArrowLeftIcon
            className="h-10 w-10 text-black cursor-pointer"
            onClick={() => route.back()}
          />
          <h1 className="text-4xl font-serif text-primary ">
            Update Blog Post
          </h1>
        </div>

        <div className="space-y-8">
          {/* Title Section */}
          <Card className="backdrop-blur-md border border-white/20">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">📝</span> Blog Title
              </div>
              <div className="mt-8">
                <Input
                  placeholder="Enter Blog Title"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg"
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card className="backdrop-blur-md border border-white/20">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">📸</span> Cover Image
              </div>
              <div className="mt-8">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    required
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center cursor-pointer bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ImageUp className="mr-2" />
                    Upload Cover Image
                  </label>
                  {imagePreview && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-52 h-40 object-cover rounded-md border-2 border-primary/30"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        disabled={isSubmitting}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tour Type Dropdown Section */}
          <Card className="backdrop-blur-md border border-white/20">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">🌍</span> Select Category{" "}
                <span className="text-red-500 italic text-sm">(required)</span>
              </div>
              <div className="mt-8">
                <select
                  value={selectedTourTypeId}
                  onChange={(e) => setSelectedTourTypeId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="">Select a tour type</option>
                  {tripsTours.map((tour) => (
                    <option key={tour._id} value={tour._id}>
                      {tour.tourType}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Blog Content Section */}
          <Card className="backdrop-blur-md border border-white/20">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">📄</span> Blog Content
              </div>
              <div className="mt-8">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  onInit={(evt, editor) => {
                    editorRef.current = editor
                  }}
                  value={description}
                  onEditorChange={(content) => setDescription(content)}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
              {/* text area  */}
              {/* <div className="mt-8">
                <Textarea
                  placeholder="Enter Blog Description"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-lg h-96"
                  disabled={isSubmitting}
                />
              </div> */}
            </CardContent>
          </Card>

          {/* Related Links Section */}
          <Card className="backdrop-blur-md border border-white/20">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">🔗</span> Related Links
              </div>
              <div className="mt-8 space-y-4">
                {links.map((link, index) => (
                  <div key={index} className="flex space-x-2 items-center">
                    <Input
                      placeholder="Link Text"
                      value={link.key}
                      onChange={(e) =>
                        handleLinkChange(index, "key", e.target.value)
                      }
                      className="flex-1"
                      disabled={isSubmitting}
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        handleLinkChange(index, "url", e.target.value)
                      }
                      className="flex-1"
                      disabled={isSubmitting}
                    />
                    {links.length > 1 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveLink(index)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddLink}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              onClick={handleEditBlog}
              disabled={
                !title ||
                !description.replace(/<[^>]*>/g, "").trim() ||
                // !image ||
                !selectedTourTypeId ||
                isSubmitting
              }
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium 
              rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.01] transition-all duration-200 
              shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <Loader2Icon className="mr-2 animate-spin" /> Updating...
                </div>
              ) : (
                "Update Blog Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditBlogForm
