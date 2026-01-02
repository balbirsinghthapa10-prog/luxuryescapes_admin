//updated
"use client"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Trash2,
  Camera,
  Hotel,
  MapPin,
  Search,
  X,
  CookieIcon,
} from "lucide-react"
import { ItineraryType } from "../Types/Types"
import Image from "next/image"
import { Textarea } from "../ui/textarea"

interface AccommodationResponseType {
  _id: string
  accommodationTitle: string
  accommodationPics: string[]
  accommodationLocation: string
  accommodationRating: string
  slug: string
}

interface FineDiningResponseType {
  _id: string
  title: string
  pics: string[]
  location: string
  slug: string
  rating: string
}

// Create a new type for the incoming data format
interface ItineraryWithAccommodationObjectsType {
  day: string
  title: string
  description: string
  note?: string
  itineraryDayPhoto?: File | string | null
  itineraryDayPhotoPreview?: string

  accommodation: {
    _id: string
    accommodationPics: string[]
    accommodationTitle: string
    slug: string
  }[]
  fineDining: {
    _id: string
    pics: string[]
    title: string
    slug: string
  }
  links: { text: string; url: string }[]
}

interface ItinerariesInputProps {
  itineraries: ItineraryType[] | ItineraryWithAccommodationObjectsType[]
  setItineraries: React.Dispatch<React.SetStateAction<ItineraryType[]>>
  previewPhotosCurrentDays?: string[]
  setDayImagesToRemove?: React.Dispatch<React.SetStateAction<string[]>>
  error: string
}

const ItinerariesInput: React.FC<ItinerariesInputProps> = ({
  itineraries: initialItineraries,
  setItineraries,
  previewPhotosCurrentDays,
  setDayImagesToRemove,
  error,
}) => {
  const [accommodations, setAccommodations] = useState<
    AccommodationResponseType[]
  >([])
  const [fineDining, setFineDining] = useState<FineDiningResponseType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFineDiningQuery, setSearchFineDiningQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [formattedItineraries, setFormattedItineraries] = useState<
    ItineraryType[]
  >([])
  const [initialProcessingDone, setInitialProcessingDone] = useState(false)

  useEffect(() => {
    if (initialItineraries.length > 0 && !initialProcessingDone) {
      const formatted = initialItineraries.map((item: any) => {
        // Check if accommodation is an array of objects
        const accommodationIds = Array.isArray(item.accommodation)
          ? item.accommodation.map((acc: any) =>
              typeof acc === "object" && acc._id ? acc._id : acc
            )
          : []

        const fineDiningIds = Array.isArray(item.fineDining)
          ? item.fineDining.map((fine: any) =>
              typeof fine === "object" && fine._id ? fine._id : fine
            )
          : []

        return {
          day: item.day || "",
          title: item.title || "",
          description: item.description || "",
          note: item.note || "", // Optional field for note
          itineraryDayPhoto: item.itineraryDayPhoto || null,
          itineraryDayPhotoPreview: item.itineraryDayPhotoPreview || "",

          accommodation: accommodationIds,
          fineDining: fineDiningIds,
          links: item.links || [],
        }
      })

      setFormattedItineraries(formatted)
      setInitialProcessingDone(true) // Mark initial processing as done
    }
  }, [initialItineraries, initialProcessingDone])

  const addItinerary = () => {
    const newItinerary: ItineraryType = {
      day: "",
      title: "",
      description: "",
      note: "", // Optional field for note
      itineraryDayPhoto: null,
      itineraryDayPhotoPreview: "",
      accommodation: [],
      fineDining: [],
      links: [],
    }
    setItineraries([...formattedItineraries, newItinerary])
    setFormattedItineraries([...formattedItineraries, newItinerary])
  }

  const updateItinerary = (index: number, updatedItinerary: ItineraryType) => {
    const updatedItineraries = formattedItineraries.map((itinerary, i) =>
      i === index ? updatedItinerary : itinerary
    )
    setItineraries(updatedItineraries)
    setFormattedItineraries(updatedItineraries)
  }

  const removeItinerary = (index: number) => {
    const updatedItineraries = formattedItineraries.filter(
      (_, i) => i !== index
    )
    setItineraries(updatedItineraries)
    setFormattedItineraries(updatedItineraries)
  }

  const updateField = (
    index: number,
    key: keyof Omit<
      ItineraryType,
      | "accommodation"
      | "fineDining"
      | "links"
      | "itineraryDayPhoto"
      | "itineraryDayPhotoPreview"
    >,
    value: string
  ) => {
    const updatedItinerary = { ...formattedItineraries[index], [key]: value }
    updateItinerary(index, updatedItinerary)
  }

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const updatedItinerary = { ...formattedItineraries[index] }

      if (
        previewPhotosCurrentDays &&
        previewPhotosCurrentDays[index] &&
        typeof previewPhotosCurrentDays[index] === "string"
      ) {
        // Add the current photo URL to imagesToRemove array
        if (setDayImagesToRemove) {
          setDayImagesToRemove((prev) => [
            ...prev,
            previewPhotosCurrentDays[index],
          ])
        }
      }

      // Store the actual file object
      updatedItinerary.itineraryDayPhoto = file
      // Create a temporary URL for preview purposes only
      updatedItinerary.itineraryDayPhotoPreview = URL.createObjectURL(file)

      updateItinerary(index, updatedItinerary)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function to revoke all object URLs
      formattedItineraries.forEach((itinerary) => {
        if (
          itinerary.itineraryDayPhotoPreview &&
          itinerary.itineraryDayPhotoPreview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(itinerary.itineraryDayPhotoPreview)
        }
      })
    }
  }, [formattedItineraries])

  const toggleAccommodation = (index: number, accommodationId: string) => {
    const updatedItinerary = { ...formattedItineraries[index] }
    const currentAccommodations = [...updatedItinerary.accommodation]

    // Check if this accommodation is already selected
    if (currentAccommodations.includes(accommodationId)) {
      // If already selected, remove it
      updatedItinerary.accommodation = currentAccommodations.filter(
        (id) => id !== accommodationId
      )
    } else {
      // If not selected and less than 3 accommodations are selected, add it
      if (currentAccommodations.length < 3) {
        updatedItinerary.accommodation = [
          ...currentAccommodations,
          accommodationId,
        ]
      } else {
        // If 3 already selected, show an alert and don't change the selection
        alert("Maximum 3 accommodations allowed per itinerary day")
        return
      }
    }

    updateItinerary(index, updatedItinerary)
  }

  const toggleFineDining = (index: number, fineDiningId: string) => {
    const updatedItinerary = { ...formattedItineraries[index] }
    const currentFineDining = [...updatedItinerary.fineDining]

    // Check if this fine dining is already selected
    if (currentFineDining.includes(fineDiningId)) {
      // If already selected, remove it
      updatedItinerary.fineDining = currentFineDining.filter(
        (id) => id !== fineDiningId
      )
    } else {
      // If not selected and less than 3 fine dining are selected, add it
      if (currentFineDining.length < 3) {
        updatedItinerary.fineDining = [...currentFineDining, fineDiningId]
      } else {
        // If 3 already selected, show an alert and don't change the selection
        alert("Maximum 3 fine dining allowed per itinerary day")
        return
      }
    }

    updateItinerary(index, updatedItinerary)
  }

  const addLink = (index: number) => {
    const updatedLinks = [
      ...formattedItineraries[index].links,
      { text: "", url: "" },
    ]
    const updatedItinerary = {
      ...formattedItineraries[index],
      links: updatedLinks,
    }
    updateItinerary(index, updatedItinerary)
  }

  const updateLink = (
    index: number,
    linkIndex: number,
    key: "text" | "url",
    value: string
  ) => {
    const updatedLinks = [...formattedItineraries[index].links]
    updatedLinks[linkIndex][key] = value
    const updatedItinerary = {
      ...formattedItineraries[index],
      links: updatedLinks,
    }
    updateItinerary(index, updatedItinerary)
  }

  const removeLink = (index: number, linkIndex: number) => {
    const updatedLinks = formattedItineraries[index].links.filter(
      (_, i) => i !== linkIndex
    )
    const updatedItinerary = {
      ...formattedItineraries[index],
      links: updatedLinks,
    }
    updateItinerary(index, updatedItinerary)
  }

  const filteredAccommodations = accommodations.filter((acc) =>
    acc.accommodationTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFineDining = fineDining.filter((fine) =>
    fine.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAccommodations = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/get-all-accommodation?limit=1000`,
        {
          method: "GET",
        }
      )
      const data = await response.json()

      if (data.success) {
        setAccommodations(data.data.accommodations)
      }
    } catch (error) {
      console.error("Error fetching accommodations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFineDining = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/finedining/get-all-details?limit=1000`,
        {
          method: "GET",
        }
      )
      const data = await response.json()

      if (data.success) {
        setFineDining(data.data.formattedData)
      }
    } catch (error) {
      console.error("Error fetching fine dining:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAccommodations()
    getFineDining()
  }, [])

  return (
    <div>
      <label className="block text-lg font-medium text-gray-700">
        Itineraries <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {formattedItineraries.map((itinerary, index) => (
        <div
          key={index}
          className="mb-4 border p-4 rounded-md border-primary bg-gray-50"
        >
          <label className="text-sm italic text-gray-400">Day</label>
          <Input
            type="number"
            placeholder="Day"
            value={itinerary.day}
            onChange={(e) => updateField(index, "day", e.target.value)}
            className="mb-4 bg-white border border-primary"
            required
          />
          <label className="text-sm italic text-gray-400">Title</label>
          <Input
            type="text"
            placeholder="Title"
            value={itinerary.title}
            onChange={(e) => updateField(index, "title", e.target.value)}
            className="mb-4 bg-white border border-primary"
            required
          />
          <label className="text-sm italic text-gray-400">
            Note (optional)
          </label>
          <Textarea
            className="w-full p-2 bg-white border border-primary rounded-md mb-4"
            placeholder="Enter day note"
            value={itinerary.note || ""}
            onChange={(e) => updateField(index, "note", e.target.value)}
            rows={2}
          />
          <label className="text-sm italic text-gray-400">Description</label>
          <Textarea
            className="w-full p-2 bg-white border border-primary rounded-md mb-4"
            placeholder="Enter day description"
            value={itinerary.description}
            onChange={(e) => updateField(index, "description", e.target.value)}
            rows={3}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Day Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e)}
              className="mt-1"
            />
            {/* image preview  */}
            <div className="flex items-center gap-4 mt-2">
              <div>
                {itinerary.itineraryDayPhotoPreview && (
                  <div className="flex flex-col items-center">
                    <label className="text-sm italic text-gray-400 ">
                      Preview:
                    </label>
                    <Image
                      src={itinerary.itineraryDayPhotoPreview}
                      alt="Day Photo"
                      width={100}
                      height={100}
                      className="mt-2 w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              {previewPhotosCurrentDays && (
                <div>
                  <label className="text-sm italic text-gray-400 ">
                    Current:
                  </label>
                  <Image
                    src={previewPhotosCurrentDays[index]}
                    alt="Day Photo"
                    width={100}
                    height={100}
                    className="mt-2 w-20 h-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          {/* Accommodation section  */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">Accommodations</h3>

            {/* Selected Accommodations Section */}
            {itinerary.accommodation.length > 0 && (
              <div className="mt-2 mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Accommodations:
                </p>
                <div className="flex flex-wrap gap-2">
                  {itinerary.accommodation.map((accId) => {
                    const selectedAcc = accommodations.find(
                      (acc) => acc._id === accId
                    )
                    return selectedAcc ? (
                      <div
                        key={accId}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <Hotel size={14} className="mr-1" />
                        {selectedAcc.accommodationTitle}
                        <button
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => toggleAccommodation(index, accId)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : null
                  })}
                </div>
                <p className="text-md text-gray-500 mt-1">
                  {3 - itinerary.accommodation.length} more accommodation
                  {3 - itinerary.accommodation.length !== 1 ? "s" : ""} can be
                  selected
                  {3 - itinerary.accommodation.length === 0 && (
                    <span className="text-red-500">
                      {" "}
                      (Max limit reached, cannot select more then 3)
                    </span>
                  )}
                </p>
              </div>
            )}

            <label className="text-sm italic text-gray-400 mb-2 block">
              Note: Click on card to select accommodation (max 3)
            </label>

            <div className="mb-4 mt-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search accommodations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {/* for loading */}
            {loading && accommodations.length === 0 && (
              <p className="text-gray-500">Loading accommodations...</p>
            )}
            {/* for no accommodations */}
            {!loading && filteredAccommodations.length === 0 && (
              <p className="text-gray-500">
                No accommodations found. Try adding!
              </p>
            )}
            {filteredAccommodations.length > 0 && (
              <div className="h-96 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAccommodations.map((acc, accIndex) => (
                    <div
                      key={accIndex}
                      className={`flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                        itinerary.accommodation.includes(acc._id)
                          ? "bg-blue-50 border-blue-300"
                          : ""
                      }`}
                      onClick={() => toggleAccommodation(index, acc._id)}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={acc.accommodationPics[0]}
                          alt={acc.accommodationTitle}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <Hotel size={20} className="mr-2 text-gray-600" />
                          <p className="font-semibold text-gray-700">
                            {acc.accommodationTitle}
                          </p>
                        </div>
                        <div className="flex items-center mt-1 gap-4">
                          <p className="flex text-sm text-blue-500">
                            <MapPin size={10} className="mr-1" />
                            {acc.accommodationLocation}
                          </p>
                          <p className="text-sm text-gray-500 font-semibold">
                            ⭐
                            {Number(acc?.accommodationRating) <= 5 ? (
                              <span>{acc?.accommodationRating}</span>
                            ) : (
                              <span>Premium 5 star</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* fine dining section  */}
          <div className="mb-4 mt-10">
            <h3 className="text-lg font-bold">Fine Dining</h3>

            {/* Selected Fine dining Section */}
            {itinerary.fineDining.length > 0 && (
              <div className="mt-2 mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Fine Dining:
                </p>
                <div className="flex flex-wrap gap-2">
                  {itinerary.fineDining.map((fineId) => {
                    const selectedFine = fineDining.find(
                      (fine) => fine._id === fineId
                    )
                    return selectedFine ? (
                      <div
                        key={fineId}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <CookieIcon size={14} className="mr-1" />
                        {selectedFine.title}
                        <button
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => toggleFineDining(index, fineId)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : null
                  })}
                </div>
                <p className="text-md text-gray-500 mt-1">
                  {3 - itinerary.fineDining.length} more fine dining
                  {3 - itinerary.fineDining.length !== 1 ? "s" : ""} can be
                  selected
                  {3 - itinerary.fineDining.length === 0 && (
                    <span className="text-red-500">
                      {" "}
                      (Max limit reached, cannot select more then 3)
                    </span>
                  )}
                </p>
              </div>
            )}

            <label className="text-sm italic text-gray-400 mb-2 block">
              Note: Click on card to select fine dining (max 3)
            </label>

            <div className="mb-4 mt-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search fine dining..."
                  value={searchFineDiningQuery}
                  onChange={(e) => setSearchFineDiningQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {/* for loading */}
            {loading && fineDining.length === 0 && (
              <p className="text-gray-500">Loading fine dining...</p>
            )}
            {/* for no fine dining */}
            {!loading && filteredFineDining.length === 0 && (
              <p className="text-gray-500">No fine dining found. Try adding!</p>
            )}
            {filteredFineDining.length > 0 && (
              <div className="h-96 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFineDining.map((fine, fineIndex) => (
                    <div
                      key={fineIndex}
                      className={`flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                        itinerary.fineDining.includes(fine._id)
                          ? "bg-blue-50 border-blue-300"
                          : ""
                      }`}
                      onClick={() => toggleFineDining(index, fine._id)}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={fine.pics[0]}
                          alt={fine.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <CookieIcon
                            size={20}
                            className="mr-2 text-gray-600"
                          />
                          <p className="font-semibold text-gray-700">
                            {fine.title}
                          </p>
                        </div>
                        <div className="flex items-center mt-1 gap-4">
                          <p className="flex text-sm text-blue-500">
                            <MapPin size={10} className="mr-1" />
                            {fine.location}
                          </p>
                          <p className="text-sm text-gray-500 font-semibold">
                            ⭐
                            {Number(fine.rating) <= 5 ? (
                              <span>{fine.rating}</span>
                            ) : (
                              <span>Premium 5 star</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Links</h3>
            {itinerary.links.map((link, linkIndex) => (
              <div key={linkIndex} className="flex items-center mb-2">
                <Input
                  type="text"
                  placeholder="Text"
                  value={link.text}
                  onChange={(e) =>
                    updateLink(index, linkIndex, "text", e.target.value)
                  }
                  className={`mr-2 ${
                    !link.text.trim() && link.url.trim() ? "border-red-500" : ""
                  }`}
                />
                <Input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    updateLink(index, linkIndex, "url", e.target.value)
                  }
                  required
                  className={`mr-2 ${
                    !link.text.trim() && link.url.trim() ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  onClick={() => removeLink(index, linkIndex)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addLink(index)}
              variant="outline"
            >
              <Camera size={16} className="mr-2" />
              Add Link
            </Button>
          </div>

          <Button
            type="button"
            onClick={() => removeItinerary(index)}
            variant="destructive"
          >
            <Trash2 size={18} className="mr-2" />
            Remove Itinerary
          </Button>
        </div>
      ))}

      <Button type="button" onClick={addItinerary} className="mt-4 text-white">
        Add Itinerary
      </Button>
    </div>
  )
}

export default ItinerariesInput
