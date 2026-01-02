"use client"
import React, { useState, ChangeEvent, useEffect, use } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import axios from "axios"
import { set, z } from "zod"
import TitleInput from "../Common/TitleInput"
import LocationInput from "../Common/LocationInput"
import RatingInput from "./accommodationForm/RatingInput"
import OverviewInput from "../Common/OverviewInput"

import FeatureInput from "./accommodationForm/FeaturesInput"
import AmenitiesInput from "./accommodationForm/AmenitiesInput"
import AccoImages from "./accommodationForm/AccoImages"
import RoomInput from "./accommodationForm/RoomInput"
import EditRoom from "./accommodationForm/EditRoom"
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
import DestinationSelect from "./accommodationForm/DestinationSelect"
import LogoInput from "./accommodationForm/LogoInput"

interface Room {
  _id: string
  slug: string
  roomTitle: string
  roomPhotos: string[]
  roomStandard: string
  roomDescription: string
  roomFacilities: string[]
  accommodationId: string
  imageToDelete?: string[]
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

const EditAccommodation: React.FC<EditAccommodationProps> = ({ slug }) => {
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

  //for edit room
  const [editRoomDetails, setEditRoomDetails] = useState<Room>({
    _id: "",
    slug: "",
    roomTitle: "",
    roomPhotos: [],
    roomStandard: "",
    roomDescription: "",
    roomFacilities: [],
    accommodationId: "",
    imageToDelete: [],
  })

  const [rooms, setRooms] = useState<Room[]>([])
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  const [showAddRoomForm, setShowAddRoomForm] = useState<boolean>(false)
  const [showEditRoomForm, setShowEditRoomForm] = useState<boolean>(false)

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
  const getSingleAccommodation = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/get-by/${slug}`
      )
      const data = response.data

      if (data.success) {
        setId(data.data._id)
        setTitle(data.data.accommodationTitle)
        setLocation(data.data.accommodationLocation)
        setCountry(data.data.country)
        setDestination(data.data.destination)
        setRating(data.data.accommodationRating)
        setOverview(data.data.accommodationDescription)
        setFeatures(data.data.accommodationFeatures)
        setAmenities(data.data.accommodationAmenities)
        setOldImagesPreviews(data.data.accommodationPics)
        setRooms(data.data.rooms)
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

    formData.append("accommodationTitle", title)
    formData.append("accommodationLocation", location)
    formData.append("country", country)
    formData.append("destination", destination)
    formData.append("accommodationRating", rating.toString())
    formData.append("accommodationDescription", overview)
    formData.append("accommodationFeatures", JSON.stringify(features))
    formData.append("accommodationAmenities", JSON.stringify(amenities))
    // formData.append("accommodationPics", images)
    images.forEach((image, index) => {
      formData.append("accommodationPics", image, `image_${index}`)
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
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/edit/${id}`,
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

  const handleRoomDelete = async ({
    roomId,
    roomName,
  }: {
    roomId: string
    roomName: string
  }) => {
    setDeleteLoading(true)
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${roomName}"?`
    )
    if (!confirmDelete) {
      setDeleteLoading(false)
      return
    }

    // Create the delete promise but don't await it yet
    const deletePromise = axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL_PROD}/room/delete/${roomId}`
    )

    // Use toast.promise with the promise
    toast.promise(deletePromise, {
      loading: "Deleting room...",
      success: (response) => {
        const data = response.data
        if (data.success) {
          setRooms((prev) => prev.filter((room) => room._id !== roomId))
          return data.message || "Room deleted successfully"
        } else {
          return data.message || "Room deleted but something went wrong"
        }
      },
      error: "Failed to delete room",
    })

    // Make sure to handle any errors and always reset loading state
    try {
      await deletePromise
    } catch (error) {
      console.error("Error deleting room:", error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // In EditRoom success callback
  const onUpdateSuccess = () => {
    setShowEditRoomForm(false)
    setShowAddRoomForm(false)
    // Update only the edited room in the list
    getSingleAccommodation()
  }
  //for add room success
  const onAddRoomSuccess = () => {
    setShowAddRoomForm(false)
    getSingleAccommodation()
  }

  //for edit room handle change
  const handleEditRoomChange = (roomDetails: Room) => {
    setShowEditRoomForm(true)
    setShowAddRoomForm(false)
    setEditRoomDetails({ ...roomDetails, accommodationId: id })
  }

  useEffect(() => {
    getSingleAccommodation()
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
            Edit Your Luxury Accommodation
          </h1>
        </div>

        {/* Button for adding room */}
        <div className="flex justify-start mb-8">
          {!showEditRoomForm && (
            <button
              className="flex  "
              onClick={() => setShowAddRoomForm(!showAddRoomForm)}
            >
              {showAddRoomForm ? (
                <div
                  className="flex items-center gap-2 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 
            transition-all duration-200 bg-red-600"
                >
                  <XIcon className="w-6 h-6 mr-2" /> Close Form
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 
            transition-all duration-200 bg-blue-600"
                >
                  <PlusIcon className="w-6 h-6 mr-2" /> Add Room
                </div>
              )}
            </button>
          )}
        </div>
        {/* button for edit room  */}
        {showEditRoomForm && (
          <div className="flex justify-start mb-8">
            <button
              className="flex bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 
            transition-all duration-200"
              onClick={() => setShowEditRoomForm(false)}
            >
              <XIcon className="w-6 h-6 mr-2" /> Close Form
            </button>
          </div>
        )}

        {/* Room Form */}
        {showAddRoomForm && (
          <Card className="">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">🛏️</span> Add Room
              </div>
              <div className="mt-8">
                <RoomInput
                  accommodationId={id}
                  onAddRoomSuccess={onAddRoomSuccess}
                />
              </div>
            </CardContent>
          </Card>
        )}
        {/* Edit Room Form */}
        {showEditRoomForm && (
          <Card className="">
            <CardContent className="p-8">
              <div className="flex gap-2 text-2xl font-semibold">
                <span className="text-blue-400">🛏️</span> Edit Room
              </div>
              <div className="mt-8">
                <EditRoom
                  roomDetails={editRoomDetails}
                  setShowEditRoomForm={setShowEditRoomForm}
                  onUpdateSuccess={onUpdateSuccess}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        {!showAddRoomForm && !showEditRoomForm && (
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
                    <span className="text-blue-400">📸</span> Accommodation
                    Images
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
                    <span className="text-blue-400">🛁</span> Amenities
                  </div>
                  <div className="mt-8">
                    <AmenitiesInput
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
                    "Update Accommodation"
                  )}
                </button>
              </div>
            </form>
            {/* room data  */}
            <div className="mt-8">
              <Card>
                <CardContent>
                  <div>
                    <div className="flex justify-between items-center mb-6 mt-6">
                      {/* Rooms section */}
                      <h2 className="text-xl font-bold mb-6">
                        Available Rooms
                      </h2>
                      <div className="flex justify-start mb-8">
                        <button
                          className="flex bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 
            transition-all duration-200"
                          onClick={() => setShowAddRoomForm(!showAddRoomForm)}
                        >
                          <PlusIcon className="w-6 h-6 mr-2" /> Add Room
                        </button>
                      </div>
                    </div>

                    {rooms.length === 0 ? (
                      <p className="text-gray-500">
                        No rooms available for this accommodation.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                          <div
                            key={room._id}
                            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                          >
                            {/* Room image */}
                            <div className="relative h-48 w-full">
                              {room.roomPhotos && room.roomPhotos.length > 0 ? (
                                <img
                                  src={room.roomPhotos[0]}
                                  alt={room.roomTitle}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">
                                    No image available
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Room details */}
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold">
                                  {room.roomTitle}
                                </h3>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {room.roomStandard}
                                </span>
                              </div>

                              <p className="text-gray-600 mb-4">
                                {room.roomDescription}
                              </p>

                              {/* Facilities */}
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Facilities:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {room.roomFacilities.map(
                                    (facility, index) => (
                                      <span
                                        key={index}
                                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                      >
                                        {facility}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-4 justify-between items-center bg-gray-100 p-4">
                              <button
                                disabled={deleteLoading}
                                onClick={() => handleEditRoomChange(room)}
                                className="flex w-full items-center justify-center bg-blue-500 text-white font-medium py-2 px-4 rounded-b-lg hover:bg-blue-600 transition-all duration-200"
                              >
                                <PenBox className="w-6 h-6" />
                                <span className="ml-2">Edit</span>
                              </button>
                              {/* delete  */}
                              <button
                                disabled={deleteLoading}
                                onClick={() =>
                                  handleRoomDelete({
                                    roomId: room._id,
                                    roomName: room.roomTitle,
                                  })
                                }
                                className="flex w-full items-center justify-center bg-red-500 text-white font-medium py-2 px-4 rounded-b-lg hover:bg-red-600 transition-all duration-200"
                              >
                                <Trash2Icon className="w-6 h-6" />
                                <span className="ml-2">Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EditAccommodation
