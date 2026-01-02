"use client"
import React, { useEffect, useState } from "react"
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
import Image from "next/image"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import axios from "axios"
import { usePathname } from "next/navigation"

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

interface ItineraryType {
  day: string
  title: string
  description: string
  note?: string
  itineraryDayPhoto?: File | null
  itineraryDayPhotoPreview?: string
  accommodation: string[]
  fineDining: string[]
  links: { text: string; url: string }[]
}

const AddNewItinerary = ({ onClose }: { onClose: () => void }) => {
  const [itinerary, setItinerary] = useState<ItineraryType>({
    day: "",
    title: "",
    description: "",
    accommodation: [],
    fineDining: [],
    note: "",
    links: [],
    itineraryDayPhoto: null,
    itineraryDayPhotoPreview: "",
  })

  const [accommodations, setAccommodations] = useState<
    AccommodationResponseType[]
  >([])
  const [fineDining, setFineDining] = useState<FineDiningResponseType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFineDiningQuery, setSearchFineDiningQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [currentPhotoPreview, setCurrentPhotoPreview] = useState<string | null>(
    null
  )
  const [addingItinerary, setAddingItinerary] = useState(false)

  const updateField = (
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
    setItinerary((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setItinerary((prev) => ({
        ...prev,
        itineraryDayPhoto: file,
        itineraryDayPhotoPreview: URL.createObjectURL(file),
      }))
    }
  }

  const pathname = usePathname()
  const packageSlug = pathname.split("/")[3] || ""

  useEffect(() => {
    return () => {
      if (itinerary.itineraryDayPhotoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(itinerary.itineraryDayPhotoPreview)
      }
    }
  }, [itinerary.itineraryDayPhotoPreview])

  const toggleAccommodation = (accommodationId: string) => {
    setItinerary((prev) => {
      const currentAccommodations = [...prev.accommodation]

      if (currentAccommodations.includes(accommodationId)) {
        return {
          ...prev,
          accommodation: currentAccommodations.filter(
            (id) => id !== accommodationId
          ),
        }
      } else {
        if (currentAccommodations.length < 3) {
          return {
            ...prev,
            accommodation: [...currentAccommodations, accommodationId],
          }
        } else {
          alert("Maximum 3 accommodations allowed per itinerary day")
          return prev
        }
      }
    })
  }

  const toggleFineDining = (fineDiningId: string) => {
    setItinerary((prev) => {
      const currentFineDining = [...prev.fineDining]

      if (currentFineDining.includes(fineDiningId)) {
        return {
          ...prev,
          fineDining: currentFineDining.filter((id) => id !== fineDiningId),
        }
      } else {
        if (currentFineDining.length < 3) {
          return {
            ...prev,
            fineDining: [...currentFineDining, fineDiningId],
          }
        } else {
          alert("Maximum 3 fine dining allowed per itinerary day")
          return prev
        }
      }
    })
  }

  const addLink = () => {
    setItinerary((prev) => ({
      ...prev,
      links: [...prev.links, { text: "", url: "" }],
    }))
  }

  const updateLink = (
    linkIndex: number,
    key: "text" | "url",
    value: string
  ) => {
    setItinerary((prev) => {
      const updatedLinks = [...prev.links]
      updatedLinks[linkIndex][key] = value
      return { ...prev, links: updatedLinks }
    })
  }

  const removeLink = (linkIndex: number) => {
    setItinerary((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== linkIndex),
    }))
  }

  const filteredAccommodations = accommodations.filter((acc) =>
    acc.accommodationTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFineDining = fineDining.filter((fine) =>
    fine.title.toLowerCase().includes(searchFineDiningQuery.toLowerCase())
  )

  const getAccommodations = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/accommodation/get-all-accommodation?limit=1000`,
        { method: "GET" }
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
        { method: "GET" }
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

  const handleAddItinerary = async () => {
    // Validation
    if (!itinerary.day || !itinerary.title || !itinerary.description) {
      setError("Please fill in all required fields (Day, Title, Description)")
      return
    }

    // Check if links have both text and URL
    const invalidLinks = itinerary.links.some(
      (link) =>
        (link.text.trim() && !link.url.trim()) ||
        (!link.text.trim() && link.url.trim())
    )
    if (invalidLinks) {
      setError("Each link must have both text and URL, or remove empty links")
      return
    }

    const formData = new FormData()

    formData.append("day", itinerary.day)
    formData.append("title", itinerary.title)
    formData.append("description", JSON.stringify(itinerary.description))
    formData.append("note", JSON.stringify(itinerary.note || ""))

    // Array fields must be JSON-stringified
    formData.append("accommodation", JSON.stringify(itinerary.accommodation))
    formData.append("fineDining", JSON.stringify(itinerary.fineDining))
    formData.append("links", JSON.stringify(itinerary.links))

    // File upload (if any)
    if (itinerary.itineraryDayPhoto) {
      formData.append("itineraryDayPhoto", itinerary.itineraryDayPhoto)
    }

    try {
      setAddingItinerary(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/itinerary/add?packageSlug=${packageSlug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      toast.success(response.data.message || "Itinerary added successfully! ")
      // Clear error and log the data
      setError("")
      // clear the form
      setItinerary({
        day: "",
        title: "",
        description: "",
        accommodation: [],
        fineDining: [],
        note: "",
        links: [],
        itineraryDayPhoto: null,
        itineraryDayPhotoPreview: "",
      })
      setCurrentPhotoPreview(null)

      // Close the add form after successful addition
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding itinerary.")
      console.error("Error adding itinerary:", error)
      setError("Failed to add itinerary. Please try again.")
    } finally {
      setAddingItinerary(false)
    }
  }

  return (
    <div className="max-full mx-auto p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="border p-6 rounded-lg border-gray-300 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Day <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Day"
              value={itinerary.day}
              onChange={(e) => updateField("day", e.target.value)}
              className="bg-white border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Title"
              value={itinerary.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="bg-white border border-gray-300"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Note (optional)
          </label>
          <Textarea
            className="w-full p-2 bg-white border border-gray-300 rounded-md"
            placeholder="Enter day note"
            value={itinerary.note || ""}
            onChange={(e) => updateField("note", e.target.value)}
            rows={2}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            className="w-full p-2 bg-white border border-gray-300 rounded-md"
            placeholder="Enter day description"
            value={itinerary.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Day Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />
          <div className="flex items-center gap-4 mt-2">
            {itinerary.itineraryDayPhotoPreview && (
              <div className="flex flex-col items-center">
                <label className="text-sm italic text-gray-400">Preview:</label>
                <Image
                  src={itinerary.itineraryDayPhotoPreview}
                  alt="Day Photo"
                  width={100}
                  height={100}
                  className="mt-2 w-20 h-20 object-cover rounded-md"
                />
              </div>
            )}
            {currentPhotoPreview && (
              <div>
                <label className="text-sm italic text-gray-400">Current:</label>
                <Image
                  src={currentPhotoPreview}
                  alt="Current Day Photo"
                  width={100}
                  height={100}
                  className="mt-2 w-20 h-20 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Accommodation section */}
        <div className="mb-6 mt-6 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Accommodations
          </h3>

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
                        onClick={() => toggleAccommodation(accId)}
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
                    (Max limit reached, cannot select more than 3)
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

          {loading && accommodations.length === 0 && (
            <p className="text-gray-500">Loading accommodations...</p>
          )}
          {!loading && filteredAccommodations.length === 0 && (
            <p className="text-gray-500">
              No accommodations found. Try adding!
            </p>
          )}

          {filteredAccommodations.length > 0 && (
            // <div className="h-96 overflow-y-auto pr-2">
            //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-96 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccommodations.map((acc) => (
                  <div
                    key={acc._id}
                    className={`flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                      itinerary.accommodation.includes(acc._id)
                        ? "bg-blue-50 border-blue-300"
                        : ""
                    }`}
                    onClick={() => toggleAccommodation(acc._id)}
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
                        <p className="flex gap-2 justify-center text-sm text-gray-500 font-semibold">
                          ⭐
                          {Number(acc?.accommodationRating) <= 5 ? (
                            <span>{acc?.accommodationRating}</span>
                          ) : (
                            <span>Premium 5 star</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mt-1 gap-4">
                        <p className="flex text-sm text-blue-500">
                          <MapPin size={10} className="mr-1" />
                          {acc.accommodationLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fine dining section */}
        <div className="mb-6 mt-6 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fine Dining</h3>

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
                        onClick={() => toggleFineDining(fineId)}
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
                    (Max limit reached, cannot select more than 3)
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

          {loading && fineDining.length === 0 && (
            <p className="text-gray-500">Loading fine dining...</p>
          )}
          {!loading && filteredFineDining.length === 0 && (
            <p className="text-gray-500">No fine dining found. Try adding!</p>
          )}

          {filteredFineDining.length > 0 && (
            <div className="h-96 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFineDining.map((fine) => (
                  <div
                    key={fine._id}
                    className={`flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                      itinerary.fineDining.includes(fine._id)
                        ? "bg-blue-50 border-blue-300"
                        : ""
                    }`}
                    onClick={() => toggleFineDining(fine._id)}
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
                        <CookieIcon size={20} className="mr-2 text-gray-600" />
                        <p className="font-semibold text-gray-700">
                          {fine.title}
                        </p>
                      </div>
                      <div className="flex items-center mt-1 gap-4">
                        <p className="flex gap-2 justify-center text-sm text-gray-500 font-semibold">
                          ⭐
                          {Number(fine.rating) <= 5 ? (
                            <span>{fine.rating}</span>
                          ) : (
                            <span>Premium 5 star</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mt-1 gap-4">
                        <p className="flex text-sm text-blue-500">
                          <MapPin size={10} className="mr-1" />
                          {fine.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Links section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Links</h3>
          {itinerary.links.map((link, linkIndex) => (
            <div key={linkIndex} className="flex items-center mb-2">
              <Input
                type="text"
                placeholder="Text"
                value={link.text}
                onChange={(e) => updateLink(linkIndex, "text", e.target.value)}
                className={`mr-2 ${
                  !link.text.trim() && link.url.trim() ? "border-red-500" : ""
                }`}
              />
              <Input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(linkIndex, "url", e.target.value)}
                required
                className={`mr-2 ${
                  !link.text.trim() && link.url.trim() ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                onClick={() => removeLink(linkIndex)}
                variant="destructive"
                size="sm"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addLink} variant="outline">
            <Camera size={16} className="mr-2" />
            Add Link
          </Button>
        </div>

        <Button
          onClick={handleAddItinerary}
          disabled={addingItinerary}
          className=" bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-2 mt-6 "
        >
          {addingItinerary ? "Adding Itinerary..." : "Add Itinerary"}
        </Button>
      </div>
    </div>
  )
}

export default AddNewItinerary
