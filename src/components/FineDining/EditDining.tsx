"use client"
import React, { useState, ChangeEvent, useEffect, use } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import axios from "axios"
import { set, z } from "zod"
import TitleInput from "../Common/TitleInput"
import LocationInput from "../Common/LocationInput"

import OverviewInput from "../Common/OverviewInput"

import { toast } from "sonner"
import {
  ArrowLeft,
  DeleteIcon,
  Loader,
  Loader2Icon,
  PenBox,
  PlusCircle,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import CountryInput from "../Common/CountryInput"
import { useRouter } from "next/navigation"

import DestinationSelect from "../accommodation/accommodationForm/DestinationSelect"
import RatingInput from "../accommodation/accommodationForm/RatingInput"
import LogoInput from "../accommodation/accommodationForm/LogoInput"
import AccoImages from "../accommodation/accommodationForm/AccoImages"
import FeatureInput from "../accommodation/accommodationForm/FeaturesInput"
import Cuisine from "./Cuisine"

interface AccommodationType {
  _id: string
  title: string
  location: string
  rating: number
  country: string
  logo?: string
  destination?: {
    _id: string
    title: string
  }
  pics: string[]
  rooms: {
    roomTitle: string
    roomPhotos: string[]
    roomStandard: string
    roomDescription: string
    roomFacilities: string[]
  }[]
  isActivated: boolean
  isFeature: boolean
  slug: string
}

//validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  rating: z.number().min(1, "Rating is required"),
  overview: z.string().min(10, "Overview is required"), //description
  features: z.array(z.string()).min(1, "Feature is required"),
  amenities: z.array(z.string()).min(1, "Amenity is required"),
  images: z.array(z.string()).min(1, "Image is required"),
  rooms: z.array(
    z.object({
      roomTitle: z.string().min(1, "Room title is required"),
      roomPhotos: z.array(z.string()).min(1, "Room image is required"),
      roomStandard: z.string().min(1, "Room standard is required"),
      roomDescription: z.string().min(10, "Room description is required"),
      roomFacilities: z.array(z.string()).min(1, "Room facility is required"),
    })
  ),
})

interface EditAccommodationProps {
  slug: string
}

const EditDining: React.FC<EditAccommodationProps> = ({ slug }) => {
  const [id, setId] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [rating, setRating] = useState<string>("Select Rating")
  const [overview, setOverview] = useState<string>("")
  const [features, setFeatures] = useState<string[]>([""])
  const [amenities, setAmenities] = useState<string[]>([""])
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [oldImagesPreviews, setOldImagesPreviews] = useState<string[]>([])
  const [imageToDelete, setImageToDelete] = useState<string[]>([])

  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  //error type
  const [errors, setErrors] = useState<{
    title?: string
    location?: string
    rating?: string
    overview?: string
    features?: string
    amenities?: string
    images?: string
    rooms?: string
  }>({})

  //validation
  const validationForm = () => {
    try {
      formSchema.parse({
        title,
        location,
        country,
        rating,
        overview,
        features,
        amenities,
        images,
      })
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {
          title?: string
          location?: string
          country?: string
          rating?: string
          overview?: string
          features?: string
          amenities?: string
          images?: string
          rooms?: string
        } = {}
        error.errors.forEach((err) => {
          if (err.path[0] === "title") newErrors.title = err.message
          if (err.path[0] === "location") newErrors.location = err.message
          if (err.path[0] === "rating") newErrors.rating = err.message
          if (err.path[0] === "overview") newErrors.overview = err.message
          if (err.path[0] === "features") newErrors.features = err.message
          if (err.path[0] === "amenities") newErrors.amenities = err.message
          if (err.path[0] === "images") newErrors.images = err.message
          if (err.path[0] === "rooms") newErrors.rooms = err.message
          if (err.path[0] === "country") newErrors.country = err.message
        })
        setErrors(newErrors)
        return false
      }
      return false
    }
  }

  // get single accommodation
  const getSingleDining = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/finedining/get/${slug}`
      )
      const data = response.data

      if (data.success) {
        setId(data.data._id)
        setTitle(data.data.title)
        setLocation(data.data.location)
        setCountry(data.data.country)
        setDestination(data.data.destination)
        setRating(data.data.rating)
        setOverview(data.data.description)
        setFeatures(data.data.features)
        setAmenities(data.data.amenities)
        setOldImagesPreviews(data.data.pics)
        if (data.data.logo) {
          setLogoPreview(data.data.logo)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  //submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("title", title)
    formData.append("location", location)
    formData.append("country", country)
    formData.append("destination", destination)
    formData.append("rating", rating.toString())
    formData.append("description", overview)
    formData.append("features", JSON.stringify(features))
    formData.append("amenities", JSON.stringify(amenities))
    // formData.append("accommodationPics", images)
    images.forEach((image, index) => {
      formData.append("pics", image, `image_${index}`)
    })
    if (imageToDelete.length > 0) {
      formData.append("imageToDelete", JSON.stringify(imageToDelete))
    }

    if (logo) {
      formData.append("logo", logo)
    }

    try {
      setLoading(true)

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/finedining/edit/${id}`,
        formData
      )
      const data = response.data
      if (data.success) {
        toast.success("Accommodation updated successfully")
        router.back()
      } else {
        toast.error("Failed to update accommodation")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSingleDining()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="flex gap-10 items-center text-center mb-8">
          <ArrowLeft
            className=" w-10 h-10 cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-5xl font-serif text-primary ">
            Edit Your Luxury Fine Dining
          </h1>
        </div>

        <>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <Card className="backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex gap-2 text-2xl font-semibold">
                  <span className="text-blue-400">🏨</span> Basic Information
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-6">
                    {/* Left column inputs */}
                    <TitleInput
                      title={title}
                      setTitle={setTitle}
                      error={errors.title || ""}
                    />
                    <LocationInput
                      location={location}
                      setLocation={setLocation}
                      error={errors.location || ""}
                    />
                    <DestinationSelect
                      destination={destination}
                      setDestination={setDestination}
                    />
                    <CountryInput
                      country={country}
                      setCountry={setCountry}
                      error={errors.location || ""}
                    />
                  </div>
                  <div className="space-y-6">
                    {/* Right column inputs */}
                    <RatingInput
                      rating={rating}
                      setRating={setRating}
                      error={errors.rating || ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Images Section */}
            <Card className="backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex gap-2 text-2xl font-semibold">
                  <span className="text-blue-400">📸</span> Logo
                </div>
                <div className="mt-8">
                  <LogoInput
                    logo={logo}
                    setLogo={setLogo}
                    logoPreview={logoPreview}
                  />
                </div>
              </CardContent>
              <CardContent className="p-8">
                <div className="flex gap-2 text-2xl font-semibold">
                  <span className="text-blue-400">📸</span> Accommodation Images
                </div>
                <div className="mt-8">
                  <AccoImages
                    images={images}
                    setImages={setImages}
                    previews={previews}
                    setPreviews={setPreviews}
                    oldImagesPreviews={oldImagesPreviews}
                    setOldImagesPreviews={setOldImagesPreviews}
                    imageToDelete={setImageToDelete}
                    error={errors.images || ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Overview Section */}
            <Card className="backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex gap-2 text-2xl font-semibold">
                  <span className="text-blue-400">📝</span> Overview
                </div>
                <div className="mt-8">
                  <OverviewInput
                    overview={overview}
                    setOverview={setOverview}
                    error={errors.overview || ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex gap-2 text-2xl font-semibold">
                  <span className="text-blue-400">✨</span> Features
                </div>
                <div className="mt-8">
                  <FeatureInput
                    features={features}
                    setFeatures={setFeatures}
                    error={errors.features || ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            <Card className="backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex gap-2 text-2xl font-semibold">
                  <span className="text-blue-400">👨‍🍳</span> Cuisine
                </div>
                <div className="mt-8">
                  <Cuisine
                    amenities={amenities}
                    setAmenities={setAmenities}
                    error={errors.amenities || ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium 
              rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.01] transition-all duration-200 
              shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    Updating...{" "}
                    <Loader2Icon className="w-6 h-6  rounded-full animate-spin" />
                  </div>
                ) : (
                  "Update Dining"
                )}
              </button>
            </div>
          </form>
        </>
      </div>
    </div>
  )
}

export default EditDining
