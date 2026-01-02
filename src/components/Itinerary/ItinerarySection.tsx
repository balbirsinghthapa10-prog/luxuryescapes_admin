"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { PencilIcon, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import AddNewItinerary from "./AddItinerary"
import EditItinerary from "./EditItinerary"

// const dummyItineraries = [
//   {
//     _id: "69118dd3d07740b2300ca1f6",
//     day: "12",
//     title: "day 12",
//     description: "day 12 desc",
//     accommodation: [
//       {
//         _id: "6859186bbafc25701bb39cb0",
//         accommodationPics: [
//           "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1750669419/LuxuryEscape/tours/accommodation/images/izaseat63cgwrpwmpkxp.webp",
//         ],
//         accommodationTitle: "Mountain Lodges of Nepal - Lukla",
//         slug: "mountain-lodges-of-nepal-lukla",
//         accommodationRating: "5",
//       },
//     ],
//     fineDining: [
//       {
//         _id: "689eedb06764b3987e3898dd",
//         pics: [
//           "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1755245999/LuxuryEscape/tours/finedining/images/a0ub5vgmjdvcjnlgasw5.jpg",
//           "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1755245998/LuxuryEscape/tours/finedining/images/tnvyto0sjovu28qqc5z7.jpg",
//           "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1755245999/LuxuryEscape/tours/finedining/images/gzxpvqeafm7bkacp07x4.png",
//           "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1755245999/LuxuryEscape/tours/finedining/images/g1sb7xywqdzvd9msh51b.png",
//           "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1755245999/LuxuryEscape/tours/finedining/images/rcm0dcdwtso6f6esncj4.jpg",
//         ],
//         title: "Bhansa",
//         slug: "bhansa",
//         rating: "four star",
//       },
//     ],
//     note: "day 12 note",
//     photo:
//       "https://res.cloudinary.com/dtcfxh0z5/image/upload/v1762758099/LuxuryEscape/tours/itinerary/images/j8xyatbpitpwysqmmlay.webp",
//     packageSlug: "langtang-valley-trek",
//     links: [],
//     __v: 0,
//   },
// ]

interface ItinerarySectionProps {
  responseItinerary: any
  onUpdate: () => void
}

const ItinerarySection = ({
  responseItinerary,
  onUpdate,
}: ItinerarySectionProps) => {
  const [itineraries, setItineraries] = useState<any[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [openEditForm, setOpenEditForm] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null)
  const [formattedItineraries, setFormattedItineraries] = useState<any[]>([])

  // Setting itineraries from props
  useEffect(() => {
    if (responseItinerary && responseItinerary.length > 0) {
      setItineraries(responseItinerary)
    }
  }, [responseItinerary])

  //formatting the itineraries
  useEffect(() => {
    if (itineraries.length > 0) {
      const formatted = itineraries.map((item: any) => {
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
          _id: item._id || "",
          day: item.day || "",
          title: item.title || "",
          description: item.description || "",
          note: item.note || "", // Optional field for note
          itineraryDayPhotoPreview: item.photo || "",

          accommodation: accommodationIds,
          fineDining: fineDiningIds,
          links: item.links || [],
        }
      })

      setFormattedItineraries(formatted)
    }
  }, [itineraries])

  // Open Add New Itinerary Modal
  const handleOpenForm = () => setOpenForm(true)

  // Open Edit Itinerary Modal with selected data
  const handleOpenEditForm = (itinerary: any) => {
    setSelectedItinerary(itinerary)
    setOpenEditForm(true)
  }

  const onCloseAddForm = () => {
    setOpenForm(false)
    onUpdate()
  }

  const onCloseEditForm = () => {
    setOpenEditForm(false)
    setSelectedItinerary(null)

    onUpdate()
  }

  const cloudinaryLoader = ({
    src,
    width,
    quality,
  }: {
    src: string
    width: number
    quality: number
  }) => {
    return `${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Itineraries</h1>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {formattedItineraries.map((itinerary, index) => (
          <div
            key={index}
            onClick={() => handleOpenEditForm(itinerary)}
            className="relative rounded-xl overflow-hidden shadow-md group h-48 cursor-pointer"
          >
            <Image
              loader={() =>
                cloudinaryLoader({
                  src:
                    itinerary.itineraryDayPhotoPreview ||
                    "/public/luxurylogo.jpg",
                  width: 400,
                  quality: 75,
                })
              }
              src={
                itinerary.itineraryDayPhotoPreview || "/public/luxurylogo.jpg"
              }
              alt={itinerary.day}
              width={400}
              height={200}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"
            />
            <PencilIcon className="absolute top-3 right-3 w-6 h-6 text-white bg-black/50 rounded-full p-1 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="flex flex-col text-center">
                <h2 className="text-white text-xl font-semibold">
                  Day {itinerary.day}
                </h2>
                <h3 className="text-white  font-medium mt-1">
                  {itinerary.title.length > 30 ? (
                    <span title={itinerary.title}>
                      {itinerary.title.slice(0, 30)}...
                    </span>
                  ) : (
                    itinerary.title
                  )}
                </h3>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <div
          onClick={handleOpenForm}
          className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all"
        >
          <Plus className="w-8 h-8 text-gray-500" />
          <p className="text-gray-500 font-medium mt-2">Add Day</p>
        </div>
      </div>

      {/* Add New Itinerary Modal */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-6 animate-in fade-in-0 zoom-in-95">
          <DialogHeader className="top-0 z-10 pb-4 ">
            <DialogTitle className="text-3xl font-bold text-gray-800">
              Add New Itinerary
            </DialogTitle>
          </DialogHeader>
          <AddNewItinerary onClose={onCloseAddForm} />
        </DialogContent>
      </Dialog>

      {/* Edit Itinerary Modal */}
      <Dialog open={openEditForm} onOpenChange={setOpenEditForm}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-6 animate-in fade-in-0 zoom-in-95">
          <DialogHeader className="top-0 z-10 pb-4 ">
            <DialogTitle className="text-3xl font-bold text-gray-800">
              Edit Itinerary
            </DialogTitle>
          </DialogHeader>
          {selectedItinerary && (
            <EditItinerary
              dayItinerary={selectedItinerary}
              onClose={onCloseEditForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ItinerarySection
