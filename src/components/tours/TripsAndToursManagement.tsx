"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react"
import {
  ArrowLeft,
  ImagePlus,
  Save,
  Edit,
  Trash2,
  RefreshCw,
  Loader,
  Loader2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Define type for Trip/Tour
interface TripTour {
  _id: string
  tourType: string
  thumbnail: string
  createdAt: string
  description: string
}

const TripsAndToursManagement: React.FC = () => {
  // Form State
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // List State
  const [tripsTours, setTripsTours] = useState<TripTour[]>([])
  const [listLoading, setListLoading] = useState<boolean>(false)
  const [selectedTrip, setSelectedTrip] = useState<TripTour | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const router = useRouter()
  // Fetch Trips and Tours
  const fetchTripsTours = async () => {
    try {
      setListLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/get-all-tour-types`
      )
      if (response.data.success) {
        setTripsTours(response.data.allTourTypes)
        setListLoading(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching trips/tours:", error)
      toast.error("Failed to fetch Trips/Tours")
      setListLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchTripsTours()
  }, [])

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error("No file selected or invalid file type.")
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("tourType", title)
      formData.append("description", description)

      // Only append image if a new image is selected
      if (coverImage) {
        formData.append("thumbnail", coverImage)
      }

      let response
      if (isEditing && selectedTrip) {
        // Edit existing trip/tour
        response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/edit-tour-type/${selectedTrip._id}`,
          formData
        )
      } else {
        // Create new trip/tour
        // if (!coverImage) {
        //   toast.error("A cover image is required.")
        //   setLoading(false)
        //   return
        // }
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour/add-tour-type`,
          formData
        )
      }

      const data = response.data

      if (data.success) {
        toast.success(data.message)
        // Reset form
        setTitle("")
        setDescription("")
        setCoverImage(null)
        setImagePreview(null)
        setIsEditModalOpen(false)
        setIsEditing(false)
        setSelectedTrip(null)

        // Refresh list
        fetchTripsTours()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error saving/editing trip/tour:", error)
      toast.error(
        `Failed to ${isEditing ? "edit" : "save"} Trip/Tour. Please try again.`
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this trip/tour?"
    )
    if (!confirmDelete) return
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tour-type/delete/${id}`
      )

      if (response.data.success) {
        toast.success("Trip/Tour deleted successfully")
        fetchTripsTours()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error deleting trip/tour:", error)
      toast.error("Failed to delete Trip/Tour")
    }
  }

  const handleEditTrip = (trip: TripTour) => {
    setSelectedTrip(trip)
    setTitle(trip.tourType)
    setDescription(trip.description || "")
    setImagePreview(trip.thumbnail)
    setIsEditModalOpen(true)
    setIsEditing(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => {
              router.back()
            }}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Trips And Tours Management</h1>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Create Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Create New Trip/Tour</CardTitle>
            <CardDescription>Add a new trip or tour category</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-lg">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="mt-2 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-lg">
                  Description <span className="text-gray-400">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter trip/tour description"
                  className="mt-2 min-h-[100px] text-lg"
                />
              </div>
              {/* image  */}
              <div>
                <Label className="text-lg">
                  Cover Image <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                    id="coverImageUpload"
                  />
                  <Label
                    htmlFor="coverImageUpload"
                    className="cursor-pointer flex items-center gap-2 text-lg bg-secondary text-white hover:bg-secondary/80 py-2 px-4 rounded-md"
                  >
                    <ImagePlus className="h-5 w-5" />
                    Upload Image
                  </Label>
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center text-black space-x-2 text-lg"
                >
                  {loading ? (
                    <>
                      {isEditing ? "Updating..." : "Creating..."}{" "}
                      <Loader className="h-6 w-6 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />{" "}
                      {isEditing ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trips/Tours List */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Existing Trips/Tours</CardTitle>
              <CardDescription>View and manage your trips</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTripsTours}
              disabled={listLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <div className="flex justify-center items-center h-full mt-6">
                <Loader2Icon className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : tripsTours.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No trips or tours found
              </div>
            ) : (
              <div className="space-y-4">
                {tripsTours.map((trip) => (
                  <div
                    key={trip._id}
                    className="flex items-center justify-between bg-blue-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {/* <img
                        src={trip?.thumbnail}
                        alt={trip?.tourType}
                        className="w-16 h-16 object-cover rounded-md"
                      /> */}
                      <Image
                        src={trip?.thumbnail || "/going.png"}
                        alt={trip?.tourType}
                        width={64}
                        height={64}
                        className=" object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-semibold">{trip?.tourType}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(trip.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTrip(trip)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTrip(trip._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Trip/Tour Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={() => {
          setIsEditModalOpen(false)
          setIsEditing(false)
          setSelectedTrip(null)
          setTitle("")
          setDescription("")
          setImagePreview(null)
          setCoverImage(null)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Trip/Tour</DialogTitle>
            <DialogDescription>
              Modify the details of your trip or tour
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-lg">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />

                  <Label htmlFor="edit-description" className="mt-4 block">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-[100px] text-lg"
                  />
                </div>

                <div>
                  <Label>
                    Cover Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 flex flex-col items-center space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="editCoverImageUpload"
                    />
                    <Label
                      htmlFor="editCoverImageUpload"
                      className="cursor-pointer text-lg flex items-center gap-2 bg-secondary text-white hover:bg-secondary/80 py-2 px-4 rounded-md"
                    >
                      <ImagePlus className="h-5 w-5" />
                      Change Image
                    </Label>

                    <img
                      src={imagePreview || selectedTrip.thumbnail}
                      alt={selectedTrip.tourType}
                      className="w-full max-w-[300px] h-auto rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center text-lg text-black space-x-2"
                >
                  {loading ? (
                    <>
                      Updating...{" "}
                      <Loader2Icon className="w-6 h-6 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Update
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TripsAndToursManagement
