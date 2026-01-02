"use client"
import React, { useState, FormEvent, ChangeEvent, useEffect } from "react"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Filter,
  Globe2,
  Loader2Icon,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import MainSpinner from "@/utils/MainLoader"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { boolean } from "zod"
import { useRouter } from "next/navigation"

export interface AffiliateTypes {
  _id: string | null
  affiliatedAccommodation: string
  thumbnail: string | null
  link: string
  category?: string
  destination?: string
  isFeature?: boolean
}

interface FormDataType {
  _id: string | null
  affiliatedAccommodation: string
  thumbnail: File | null | string
  link: string
  category?: string
  destination?: string
  isFeature?: boolean
}

const AffiliatedHome = () => {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [affiliates, setAffiliates] = useState<AffiliateTypes[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [getLoading, setGetLoading] = useState(false)

  const [formData, setFormData] = useState<FormDataType>({
    _id: "",
    affiliatedAccommodation: "",
    thumbnail: null,
    link: "",
    category: "",
    destination: "",
    isFeature: false,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [destination, setDestination] = useState<any[]>([])

  const router = useRouter()

  const getDestinations = async () => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/destinations?page=1&limit=1000`,
      {
        method: "GET",
      }
    )
    const data = await response.json()

    if (data.success) {
      setDestination(data.data.destinations)
    }

    setLoading(false)
  }

  const handleAddNewClick = () => {
    setFormData({
      _id: "",
      affiliatedAccommodation: "",
      thumbnail: null,
      link: "",
      category: "",
      destination: "",
      isFeature: false,
    })
    setPreviewUrl(null)
    setIsEditing(false)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    if (file) {
      setFormData({ ...formData, thumbnail: file })

      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGetAllAffiliates = async () => {
    try {
      setGetLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/recommend/get`
      )
      const data = response.data

      if (data.success) {
        setAffiliates(data.data)
      }
    } catch (error) {
      console.error("Error fetching affiliates:", error)
    } finally {
      setGetLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEditing) {
      // Update existing affiliate
      const updatedAffiliates = affiliates.map((affiliate) =>
        affiliate._id === formData._id
          ? {
              ...affiliate,
              affiliatedAccommodation: formData.affiliatedAccommodation,
              link: formData.link,
              category: formData.category,
              thumbnail: previewUrl || affiliate.thumbnail,
            }
          : affiliate
      )

      setAffiliates(updatedAffiliates)

      // Create FormData for the specific affiliate being edited
      const formDataToSend = new FormData()
      formDataToSend.append("_id", formData._id as string)
      formDataToSend.append(
        "affiliatedAccommodation",
        formData.affiliatedAccommodation
      )

      if (formData.link) {
        formDataToSend.append("link", formData.link)
      }

      // Only append if there's a new thumbnail (File object)
      if (formData.thumbnail instanceof File) {
        formDataToSend.append("thumbnail", formData.thumbnail)
      }

      if (formData.destination) {
        formDataToSend.append("destination", formData.destination)
      }

      if (formData.category) {
        formDataToSend.append("category", formData.category)
      }

      try {
        setLoading(true)
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/recommend/edit/${formData._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        const data = response.data

        if (data.success) {
          toast.success(data.data?.message || "Affiliate updated successfully")
        } else {
          toast.error(data.data?.message || "Failed to update affiliate")
        }
      } catch (error) {
        toast.error("Failed to update affiliate")
      } finally {
        setLoading(false)
        handleGetAllAffiliates()
      }
    } else {
      // Add new affiliate
      const formDataToSend = new FormData()
      formDataToSend.append(
        "affiliatedAccommodation",
        formData.affiliatedAccommodation
      )

      if (formData.link) {
        formDataToSend.append("link", formData.link)
      }

      // Only append if there's a new thumbnail (File object)
      if (formData.thumbnail instanceof File) {
        formDataToSend.append("thumbnail", formData.thumbnail)
      }

      if (formData.destination) {
        formDataToSend.append("destination", formData.destination)
      }

      if (formData.category) {
        formDataToSend.append("category", formData.category)
      }

      try {
        setLoading(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/recommend/add`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        const data = response.data

        if (data.success) {
          toast.success(data.data?.message || "Affiliate added successfully")
        } else {
          toast.error(data.data?.message || "Failed to add affiliate")
        }
      } catch (error) {
        toast.error("Failed to add affiliate")
      } finally {
        setLoading(false)
        handleGetAllAffiliates()
      }
    }

    // Reset form
    setShowForm(false)
    setFormData({
      _id: "",
      affiliatedAccommodation: "",
      thumbnail: null,
      link: "",
      category: "",
      destination: "",
      isFeature: false,
    })
    setPreviewUrl(null)
  }

  const handleEdit = (affiliate: AffiliateTypes) => {
    setIsEditing(true)
    setFormData({ ...affiliate })
    setPreviewUrl(affiliate.thumbnail)
    setShowForm(true)
  }

  const handleDelete = async (id: string | null) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this affiliate? This action cannot be undone."
    )
    if (!confirmDelete) return
    if (id !== null) {
      try {
        setDeleteLoading(true)
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/recommend/delete/${id}`
        )
        const data = response.data

        if (data.success) {
          toast.success(data.data?.message || "Affiliate deleted successfully")
        } else {
          toast.error(data.data?.message || "Failed to delete affiliate")
        }
      } catch (error) {
        // console.error("Error fetching affiliates:", error)
        toast.error("Failed to delete affiliate")
      } finally {
        setDeleteLoading(false)
        handleGetAllAffiliates()
      }
    }
  }

  const handleUpdateFeatureStatus = async (
    id: string | null,
    isFeature: boolean
  ) => {
    if (id !== null) {
      try {
        setLoading(true)
        const response = await axios.patch(
          `${
            process.env.NEXT_PUBLIC_API_URL_PROD
          }/recommend/update/${id}?isfeature=${!isFeature}`
        )
        const data = response.data

        if (data.success) {
          toast.success(
            data.data?.message || "Affiliate feature status updated"
          )
        } else {
          toast.error(data.data?.message || "Failed to update feature status")
        }
      } catch (error) {
        toast.error("Failed to update feature status")
      } finally {
        setLoading(false)
        handleGetAllAffiliates()
      }
    }
  }

  // Filter affiliates based on search and category
  const filteredAffiliates = affiliates.filter((affiliate) => {
    const matchesSearch =
      affiliate.affiliatedAccommodation
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (affiliate.link &&
        affiliate.link.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory =
      category === "" ||
      affiliate.category?.toLowerCase() === category.toLowerCase()

    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    handleGetAllAffiliates()
    getDestinations()
  }, [])

  return (
    <div className="container bg-gray-50 mx-auto p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft onClick={() => router.back()} size={20} />
            </button>
            <h2 className="text-3xl font-bold text-gray-800">
              Affiliates Manager
            </h2>
          </div>
          <button
            onClick={handleAddNewClick}
            className="bg-primary hover:bg-primar/10 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add New Affiliate</span>
          </button>
        </div>
        <p className="text-gray-600">
          Manage your affiliated partners and their details
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search affiliates by name or link..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {isEditing ? "Edit Affiliate" : "Add New Affiliate"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* for isfeature  */}
          {isEditing && (
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-feature"
                  checked={formData.isFeature}
                  onCheckedChange={(checked) =>
                    handleUpdateFeatureStatus(formData._id, !checked)
                  }
                />
                <Label htmlFor="is-feature">Featured</Label>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* title  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="affiliatedAccommodation"
                value={formData.affiliatedAccommodation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {/* thumbnail  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail
              </label>
              <div className="flex flex-col">
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
                {previewUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* destination name dropdown  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select
                name="destination"
                value={formData.destination || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Destination</option>
                {destination &&
                  destination.map((dest) => (
                    <option key={dest._id} value={dest.title}>
                      {dest.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* link  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2Icon size={16} className="animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus size={16} />
                    {isEditing ? "Update Affiliate" : "Add Affiliate"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {getLoading && <MainSpinner />}

      {/* Affiliate Cards Grid */}
      {!getLoading && filteredAffiliates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAffiliates.map((affiliate) => (
            <div
              key={affiliate._id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
            >
              <div className="relative h-48">
                <Image
                  src={affiliate.thumbnail || ""}
                  alt={affiliate.affiliatedAccommodation}
                  className="w-full h-full object-cover"
                  width={400}
                  height={200}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(affiliate)}
                    className="p-2 bg-white rounded-full  shadow-md hover:bg-gray-100"
                  >
                    <Pencil size={16} className="text-blue-700" />
                  </button>
                  <button
                    disabled={deleteLoading}
                    onClick={() => handleDelete(affiliate._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="flex gap-4 items-center font-medium text-lg mb-1">
                  {affiliate.affiliatedAccommodation}
                  <div>
                    {affiliate.isFeature && (
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-2">
                        Featured
                      </span>
                    )}
                  </div>
                </h3>
                {affiliate.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                    {affiliate.category}
                  </span>
                )}
                {affiliate.destination && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 mr-2 rounded-full mb-2">
                    {affiliate.destination}
                  </span>
                )}
                {affiliate.link && (
                  <a
                    href={affiliate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline break-words"
                  >
                    {affiliate.link.length > 30
                      ? `${affiliate.link.substring(0, 30)}...`
                      : affiliate.link}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!getLoading && filteredAffiliates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No affiliates found. Add some using the "Add New Affiliate" button.
          </p>
        </div>
      )}
    </div>
  )
}

export default AffiliatedHome
