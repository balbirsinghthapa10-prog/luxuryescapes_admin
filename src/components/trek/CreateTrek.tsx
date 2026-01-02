"use client"

import React, { useState } from "react"
import { set, z } from "zod"

import TitleInput from "../Common/TitleInput"
import PriceInput from "../Common/PriceInput"

import CountryInput from "../Common/CountryInput"
import LocationInput from "../Common/LocationInput"
import ThumbnailInput from "../Common/ThumbnailInput"
import BestSeasonInput from "../Common/BestSeasonInput"
import OverviewInput from "../Common/OverviewInput"
// import AccommodationInput from "../Common/Accommodation"
import HighlightsInput from "../Common/HighlightsInput"
import FAQInput from "../Common/FAQInput"

import { Card, CardContent } from "@/components/ui/card"
import {
  ScrollText,
  Sparkles,
  Settings,
  Image,
  Loader2Icon,
  ArrowLeft,
} from "lucide-react"

//types
import { HighlightType, ItineraryType, FAQType } from "../Types/Types"
import MultiImageInput from "../Common/MultiImageInput"
import Inclusion from "../Common/Inclusion"
import Duration from "../Common/Duration"

import axios from "axios"
import DifficultyInput from "../Common/DifficultyInput"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Exclusions from "../Common/Exclusions"
import RouteMapImage from "../Common/RouteMapImage"
import ScrollNavigation from "../Common/ScrollNavigation"

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

const CreateTrekForm = () => {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [country, setCountry] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [days, setDays] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<File | null>(null)

  const [routeImage, setRouteImage] = useState<File | null>(null)

  const [difficulty, setDifficulty] = useState("")

  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])

  const [overview, setOverview] = useState<string>("")
  // const [accommodations, setAccommodations] = useState<string[]>([])

  const [inclusion, setInclusion] = useState<string[]>([])
  const [exclusion, setExclusion] = useState<string[]>([])

  const [highlights, setHighlights] = useState<HighlightType[]>([])

  const [faqs, setFaqs] = useState<FAQType[]>([])
  const [images, setImages] = useState<(string | File)[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [imageError, setImageError] = useState("")

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ErrorsType>({})

  const router = useRouter()

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

      // Send the request to the backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/trek/add-trek`,
        formData
      )

      if (response.data.success) {
        toast.success(response.data.message || "Trek added successfully!")
        router.push("/trekkings")
      } else {
        toast.error(response.data.message || "Failed to add trek")
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast.error(
        error?.response?.data?.message || "An error occurred, please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-10 text-center mb-4">
          <ArrowLeft onClick={() => router.back()} className="w-10 h-10 " />

          <div>
            <h1 className="text-5xl font-serif text-primary mb-4">
              Create Your Luxury Trek
            </h1>
            <p className="text-lg text-blue-400">
              Transform Dreams into Extraordinary Journeys
            </p>
          </div>
        </div>

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
                    thumbnailPreview={null}
                    error={errors.thumbnail || ""}
                  />
                  <RouteMapImage
                    routeImage={routeImage}
                    setRouteImage={setRouteImage}
                    routeImagePreview={null}
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
                  {/* <AccommodationInput
                    accommodations={accommodations}
                    setAccommodations={setAccommodations}
                    error={errors.accommodations || ""}
                  /> */}
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
              <div className="flex gap-2 mt-6 text-2xl font-semibold">
                <Settings className="w-8 h-8 text-blue-400" />
                Additional Information
              </div>
              <div className="space-y-6 mt-8">
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
                  <span>Creating...</span>{" "}
                </div>
              ) : (
                <span>Create trek</span>
              )}
            </button>
          </div>
        </form>
        <ScrollNavigation />
      </div>
    </div>
  )
}

export default CreateTrekForm
