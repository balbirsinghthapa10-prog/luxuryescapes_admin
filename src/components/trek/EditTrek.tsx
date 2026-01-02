"use client"

import React, { useEffect, useState } from "react"
import { set, z } from "zod"

import TitleInput from "../Common/TitleInput"
import PriceInput from "../Common/PriceInput"
import CountryInput from "../Common/CountryInput"
import LocationInput from "../Common/LocationInput"

import ThumbnailInput from "../Common/ThumbnailInput"

import BestSeasonInput from "../Common/BestSeasonInput"

import OverviewInput from "../Common/OverviewInput"
import AccommodationInput from "../Common/Accommodation"

import HighlightsInput from "../Common/HighlightsInput"
import ItinerariesInput from "../Common/ItineriesInput"

import FAQInput from "../Common/FAQInput"

import { Card, CardContent } from "@/components/ui/card"
import {
  ScrollText,
  Sparkles,
  Settings,
  Image,
  Loader2Icon,
  PenBoxIcon,
  Trash2Icon,
  ArrowLeftIcon,
  PlusIcon,
  ArrowLeft,
} from "lucide-react"

//types
import { HighlightType, ItineraryType, FAQType } from "../Types/Types"
import MultiImageInput from "../Common/MultiImageInput"
import { Button } from "../ui/button"
import Inclusion from "../Common/Inclusion"
import Duration from "../Common/Duration"

import axios from "axios"
import DifficultyInput from "../Common/DifficultyInput"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Exclusions from "../Common/Exclusions"
import { BookingPriceInterface } from "../Types/Types"
import AddBookingPrice from "../Common/AddBookingPrice"
import UpdateBookingPrice from "../Common/EditBookingPrice"
import RouteMapImage from "../Common/RouteMapImage"
import ScrollNavigation from "../Common/ScrollNavigation"
import AddNewItinerary from "../Itinerary/AddItinerary"
import ItinerarySection from "../Itinerary/ItinerarySection"

// Define Zod schema for form validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  country: z.string().min(1, "Country is required"),
  location: z.string().min(1, "Location is required"),
  language: z.string().min(1, "Language is required"),
  suitableAge: z.string().min(1, "Age is required"),
  maxAltitude: z.number().min(1, "Max Altitude is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  mealType: z.string().min(1, "Meal Type is required"),
  selectedSeasons: z
    .array(z.string())
    .min(1, "Please select at least one season"),
  difficulty: z.string().min(1, "Difficulty is required"),
  overview: z.string().min(1, "Overview is required"),
  accommodations: z.string().min(1, "Accommodations is required"),
  thingsToKnow: z.string().min(1, "Things to Know is required"),
  inclusion: z.array(z.string()).min(1, "Inclusion is required"),
  exclusion: z.array(z.string()).min(1, "Exclusion is required"),
  highlights: z.array(z.string()).min(1, "Highlights is required"),
  itinerary: z.array(z.string()).min(1, "Itinerary is required"),
  services: z.object({
    inclusives: z.array(z.string()).min(1, "Inclusives is required"),
    exclusives: z.array(z.string()).min(1, "Exclusives is required"),
  }),
  days: z.number().min(1, "Duration is required"),
  faqs: z.array(z.string()).min(1, "FAQs is required"),
})

// Example type definition for errors
type ErrorsType = {
  title?: string
  hobbies?: string
  price?: string
  country?: string
  location?: string
  language?: string
  difficulty?: string
  thumbnail?: string
  mealType?: string
  selectedSeasons?: string
  minDays?: string
  maxDays?: string
  minGroupSize?: string
  maxGroupSize?: string
  arrivalLocation?: string
  departureLocation?: string
  startingLocation?: string
  endingLocation?: string
  overview?: string
  accommodations?: string
  thingsToKnow?: string
  inclusion?: string
  exclusion?: string
  highlights?: string
  itinerary?: string
  services?: string
  days?: string
  faqs?: string
}

const EditTrekForm = ({ slug }: { slug: string }) => {
  const [id, setId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [country, setCountry] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [days, setDays] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")

  const [routeImage, setRouteImage] = useState<File | null>(null)
  const [routeImagePreview, setRouteImagePreview] = useState<string>("")

  const [difficulty, setDifficulty] = useState("")

  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])

  const [overview, setOverview] = useState<string>("")
  const [accommodations, setAccommodations] = useState<string[]>([])

  const [inclusion, setInclusion] = useState<string[]>([])
  const [exclusion, setExclusion] = useState<string[]>([])

  const [highlights, setHighlights] = useState<HighlightType[]>([])

  const [itineraries, setItineraries] = useState<ItineraryType[]>([])

  const [faqs, setFaqs] = useState<FAQType[]>([])
  const [images, setImages] = useState<(string | File)[]>([])
  const [imageToDelete, setImageToDelete] = useState<string[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [imageError, setImageError] = useState("")
  const [highlightPicturesPreview, setHighlightPicturesPreview] = useState<
    string[]
  >([])

  const [addBookingPriceOpen, setAddBookingPriceOpen] = useState<boolean>(false)
  const [editBookingPriceOpen, setEditBookingPriceOpen] =
    useState<boolean>(false)
  const [bookingPriceData, setBookingPriceData] =
    useState<BookingPriceInterface>({
      _id: "",
      adventureId: "",
      adventureType: "",
      solo: "",
      soloPremiumFiveStar: "",
      soloFourStar: "",
      soloFiveStar: "",
      singleSupplementary: "",
      singleSupplementaryPremiumFiveStar: "",
      singleSupplementaryFourStar: "",
      singleSupplementaryFiveStar: "",
      standardPremiumFiveStar: "",
      standardFourStar: "",
      standardFiveStar: "",
    })
  const [availableBookingPrice, setAvailableBookingPrice] =
    useState<boolean>(false)

  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [errors, setErrors] = useState<ErrorsType>({})
  const [isOpen, setIsOpen] = useState(true)

  const router = useRouter()

  //get single trek
  const handleSingleTrek = async () => {
    try {
      const response = await axios.get<{
        success: boolean
        message?: string
        data: {
          specificTrek: {
            _id: string
            trekName: string
            cost: number
            country: string
            location: string
            duration: number
            thumbnail: File | string
            routeMap: File | string
            difficultyLevel: string
            idealTime: string[]
            trekOverview: string
            accommodation: string[]
            trekInclusion: string[]
            trekExclusion: string[]
            exclude: string[]
            highlightPicture: string[]
            trekHighlights: string[]
            itineraryDayPhoto: string[]
            trekItinerary: ItineraryType[]
            faq: FAQType[]
            gallery: (string | File)[]
          }
          bookingDetails: BookingPriceInterface | null
        }
      }>(`${process.env.NEXT_PUBLIC_API_URL_PROD}/trek/specific/${slug}`)

      const { data } = response

      if (data.success) {
        const trekData = data.data.specificTrek

        // Update state with fetched trek data
        setId(trekData._id)
        setTitle(trekData.trekName)
        setPrice(trekData.cost)
        setCountry(trekData.country)
        setLocation(trekData.location)
        setDays(trekData.duration)
        if (trekData.thumbnail) {
          setThumbnailPreview(trekData.thumbnail as string)
        }
        if (trekData.routeMap) {
          setRouteImagePreview(trekData.routeMap as string)
        }

        setDifficulty(trekData.difficultyLevel)
        setSelectedSeasons(trekData.idealTime)
        setOverview(trekData.trekOverview)

        // Use null coalescing to provide fallback empty arrays
        setAccommodations(trekData.accommodation ?? [])
        setInclusion(trekData.trekInclusion ?? [])
        setExclusion(trekData.trekExclusion ?? [])

        if (trekData.highlightPicture) {
          setHighlightPicturesPreview(trekData.highlightPicture as string[])
        }

        setItineraries(trekData.trekItinerary ?? [])

        setFaqs(trekData.faq ?? [])
        setPreviews(trekData.gallery as string[])

        const hTitle = trekData.trekHighlights || []

        // Combine highlights and their pictures matching the exact interface
        const combinedHighlights = hTitle.map((title, index) => ({
          highlightsTitle: title,
          highlightPicture: null,
        }))

        // Set the combined highlights
        setHighlights(combinedHighlights)
        // setHighlightPicturesPreview(hPicture)

        //  for booking price details
        if (response.data.data.bookingDetails !== null) {
          setBookingPriceData(response.data.data.bookingDetails)
          setAvailableBookingPrice(true)
        } else {
          setAvailableBookingPrice(false)
        }
      } else {
        // Handle unsuccessful response
        toast.error(data.message || "Failed to fetch trek details")
      }
    } catch (error) {
      // Comprehensive error handling
      console.error("Error fetching trek:", error)

      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Network error occurred"
        toast.error(errorMessage)
      } else {
        // Generic error handling
        toast.error("An unexpected error occurred while fetching trek details")
      }

      // Optional: Set error state for images
      setImageError("Could not load trek images")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      // Validation checks

      if (!title || !country || !location || !days || !overview) {
        throw new Error("Please fill in all required fields")
      }

      const formData = new FormData()
      formData.append("trekName", title.trim())
      formData.append("country", country.trim())
      formData.append("location", location.trim())
      formData.append("difficultyLevel", difficulty.trim())
      formData.append("cost", price.toString())
      formData.append("duration", days.toString())
      formData.append("trekOverview", overview.trim())

      // Append thumbnail if provided
      if (thumbnail) {
        formData.append("thumbnail", thumbnail)
      }
      // Append route image if provided
      if (routeImage) {
        formData.append("routeMap", routeImage)
      }

      // Append gallery images if provided
      if (images.length > 0) {
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append("gallery", image)
          }
        })
      }

      // Append arrays and objects as JSON strings
      formData.append("idealTime", JSON.stringify(selectedSeasons))
      // formData.append("keyHighlights", JSON.stringify(highlights))
      formData.append("trekInclusion", JSON.stringify(inclusion))
      formData.append("trekExclusion", JSON.stringify(exclusion))

      formData.append("faq", JSON.stringify(faqs))

      const highlightTitles = highlights.map(
        (highlight) => highlight.highlightsTitle
      )
      formData.append("trekHighlights", JSON.stringify(highlightTitles))

      if (imageToDelete.length > 0) {
        formData.append("galleryToDelete", JSON.stringify(imageToDelete))
      }

      // Send the request to the backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/trek/edit/${id}`,
        formData
      )

      if (response.data.success) {
        toast.success(response.data.message || "Trek updated successfully!")
        router.push("/trekkings")
      } else {
        toast.error(response.data.message || "Failed to update trek")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAddBookingPrice = () => {
    setAddBookingPriceOpen(!addBookingPriceOpen)
    setIsOpen(!isOpen)
  }
  const handleEditBookingPrice = () => {
    setEditBookingPriceOpen(!editBookingPriceOpen)
    setIsOpen(!isOpen)
  }

  const onSuccess = () => {
    handleSingleTrek()
    setAddBookingPriceOpen(false)
    setEditBookingPriceOpen(false)
    setIsOpen(true)
  }

  const handleDeleteBookingPrice = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the booking price?"
    )
    if (!confirmDelete) return
    try {
      setDeleteLoading(true)
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/delete-booking-price/${bookingPriceData?._id}`
      )

      if (response.data.success) {
        toast.success(response.data.message || "Booking Price Removed")

        setAvailableBookingPrice(false)
      } else {
        toast.error(
          response.data.message ||
            "Unable to Delete Booking Price, Please Try Again!"
        )
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error occurred while deleting the booking price.")
    } finally {
      setDeleteLoading(false)
    }
  }

  // if any itinerary changes, refetch the single trek data
  const handleReFetchData = () => {
    handleSingleTrek()
  }

  useEffect(() => {
    handleSingleTrek()
  }, [])

  return (
    <div className="relative min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-10 text-center mb-4">
            <ArrowLeft onClick={() => router.back()} className="w-10 h-10 " />

            <div>
              <h1 className="text-5xl font-serif text-primary mb-4">
                Edit Your Luxury Trek
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4 mt-2">
            {availableBookingPrice ? (
              <>
                <Button
                  type="button"
                  onClick={handleEditBookingPrice}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editBookingPriceOpen ? (
                    <>
                      <ArrowLeftIcon className="w-6 h-6" /> Back to form
                    </>
                  ) : (
                    <>
                      <PenBoxIcon className="w-6 h-6" /> Edit Booking Price
                    </>
                  )}
                </Button>
                {/* delete  */}
                <Button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => handleDeleteBookingPrice()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2Icon className="w-6 h-6" />{" "}
                  {deleteLoading ? "Deleting..." : "Delete Booking Price"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleAddBookingPrice}
                className="bg-primary hover:bg-primary/90"
              >
                {addBookingPriceOpen ? (
                  <>
                    <ArrowLeftIcon className="w-6 h-6" /> Back to form
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6" /> Add Booking Price
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* for add booking price component */}
        {!availableBookingPrice && addBookingPriceOpen && (
          <div className="absolute top-36 left-1/3 z-100 mt-6">
            <AddBookingPrice
              adventureType="Trekking"
              adventureId={id}
              onSuccess={onSuccess}
            />
          </div>
        )}
        {/* for edit booking price component */}
        {availableBookingPrice && editBookingPriceOpen && (
          <div className="absolute top-36 left-1/3 z-100 mt-6 ">
            <UpdateBookingPrice
              adventureType="Trekking"
              adventureId={id}
              onSuccess={onSuccess}
              bookingPriceDetails={bookingPriceData}
            />
          </div>
        )}

        {isOpen && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <Card className=" backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                {/* <SectionHeader icon={ScrollText} title="Basic Information" /> */}
                <div className="flex gap-2 text-2xl font-semibold">
                  <ScrollText className="w-8 h-8 text-blue-400" /> Basic
                  Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-6">
                    {/* Left column inputs */}
                    <TitleInput
                      title={title}
                      setTitle={setTitle}
                      error={errors.title || ""}
                    />
                    <PriceInput
                      price={price}
                      setPrice={setPrice}
                      error={errors.price || ""}
                    />
                    <CountryInput
                      country={country}
                      setCountry={setCountry}
                      error={errors.country || ""}
                    />
                    <Duration
                      days={days}
                      setDays={setDays}
                      error={errors.days || ""}
                    />
                    <LocationInput
                      location={location}
                      setLocation={setLocation}
                      error={errors.location || ""}
                    />
                    <DifficultyInput
                      difficulty={difficulty}
                      setDifficulty={setDifficulty}
                      error={errors.difficulty || ""}
                    />
                  </div>
                  <div className="space-y-6">
                    <ThumbnailInput
                      thumbnail={thumbnail}
                      setThumbnail={setThumbnail}
                      thumbnailPreview={thumbnailPreview}
                      error={errors.thumbnail || ""}
                    />
                    <RouteMapImage
                      routeImage={routeImage}
                      setRouteImage={setRouteImage}
                      routeImagePreview={routeImagePreview}
                    />
                  </div>
                  <div className="space-y-6 mt-8">
                    <BestSeasonInput
                      selectedSeasons={selectedSeasons}
                      setSelectedSeasons={setSelectedSeasons}
                      error={errors.selectedSeasons || ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descriptions Section */}
            <Card className=" backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                {/* <SectionHeader icon={ScrollText} title="Descriptions" /> */}
                <div className="flex gap-2 text-2xl font-semibold">
                  <ScrollText className="w-8 h-8 text-blue-400" /> Descriptions
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-6">
                    {/* overview  */}
                    <OverviewInput
                      overview={overview}
                      setOverview={setOverview}
                      error={errors.overview || ""}
                    />

                    {/* accommodation  */}
                    <AccommodationInput
                      accommodations={accommodations}
                      setAccommodations={setAccommodations}
                      error={errors.accommodations || ""}
                    />
                    {/* things to know  */}
                    <Inclusion
                      inclusion={inclusion}
                      setInclusion={setInclusion}
                      error={errors.inclusion || ""}
                    />
                    <Exclusions
                      exclusion={exclusion}
                      setExclusion={setExclusion}
                      error={errors.exclusion || ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
            <Card className=" backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                {/* <SectionHeader icon={Sparkles} title="Highlights & Services" /> */}
                <div className="flex gap-2 text-2xl font-semibold">
                  <Sparkles className="w-8 h-8 text-blue-400" /> Highlights &
                  Services
                </div>
                <div className="space-y-6 mt-8">
                  {/* HIGHLIGHTS  */}
                  <HighlightsInput
                    highlights={highlights}
                    setHighlights={setHighlights}
                    error={errors.highlights || ""}
                  />
                </div>

                {/* <SectionHeader icon={Settings} title="Additional Information" /> */}
                <div className="flex gap-2 mt-10 text-2xl font-semibold">
                  <Settings className="w-8 h-8 text-blue-400" />
                  Additional Information
                </div>
                <div className="space-y-6 mt-8">
                  {/* ITINERARIES  */}
                  <ItinerarySection
                    responseItinerary={itineraries}
                    onUpdate={handleReFetchData}
                  />
                  {/* <ItinerariesInput
                    itineraries={itineraries}
                    setItineraries={setItineraries}
                    previewPhotosCurrentDays={itineraryDayPhotoPreview}
                    setDayImagesToRemove={setDayImagesToDelete}
                    error={errors.itinerary || ""}
                  /> */}

                  {/* FAQ  */}
                  <FAQInput faqs={faqs} setFaqs={setFaqs} />
                </div>
              </CardContent>
            </Card>
            {/* </div> */}

            {/* Media Section */}
            <Card className=" backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                {/* <SectionHeader icon={Image} title="Media Gallery" /> */}
                <div className="flex gap-2 text-2xl font-semibold">
                  <Image className="w-8 h-8 text-blue-400" /> Media Gallery
                </div>

                <div className="space-y-8 mt-8">
                  {/* MULTIPLE IMAGES  */}
                  <MultiImageInput
                    images={images}
                    setImages={setImages}
                    previews={previews}
                    setPreviews={setPreviews}
                    imageError={imageError}
                    setImageError={setImageError}
                    setImageToDelete={setImageToDelete}
                  />

                  {/* VIDEO  */}
                  {/* <VideoUploadInput video={video} setVideo={setVideo} /> */}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium 
              rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.01] transition-all duration-200 
              shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
              >
                {loading ? (
                  <div className="flex gap-2">
                    <Loader2Icon className="w-6 h-6 animate-spin" />{" "}
                    <span>Updating...</span>{" "}
                  </div>
                ) : (
                  <span>Update trek</span>
                )}
              </button>
            </div>
          </form>
        )}

        <ScrollNavigation />
      </div>
    </div>
  )
}

export default EditTrekForm
