import axios from "axios"
import { on } from "events"
import { Loader2Icon, Trash2Icon } from "lucide-react"
import React, { useState, useEffect } from "react"
import { toast } from "sonner"

interface RoomDetails {
  _id: string
  roomTitle: string
  roomStandard: string
  roomDescription: string
  roomFacilities: string[]
  roomPhotos: string[] // URLs of existing photos
  accommodationId: string // Accommodation ID
}

interface EditRoomProps {
  roomDetails: RoomDetails
  setShowEditRoomForm: React.Dispatch<React.SetStateAction<boolean>>
  onUpdateSuccess?: () => void
}

const EditRoom: React.FC<EditRoomProps> = ({
  roomDetails,
  setShowEditRoomForm,
  onUpdateSuccess,
}) => {
  // State for the room details form
  const [roomTitle, setRoomTitle] = useState("")
  const [roomStandard, setRoomStandard] = useState("")
  const [roomDescription, setRoomDescription] = useState("")
  const [roomFacilities, setRoomFacilities] = useState<string[]>([""])

  // State for handling photos
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([])
  const [newPhotos, setNewPhotos] = useState<File[]>([])

  const [loading, setLoading] = useState(false)

  // Populate form with existing room data
  useEffect(() => {
    if (roomDetails) {
      setRoomTitle(roomDetails.roomTitle)
      setRoomStandard(roomDetails.roomStandard)
      setRoomDescription(roomDetails.roomDescription)
      setRoomFacilities(
        roomDetails.roomFacilities.length ? roomDetails.roomFacilities : [""]
      )
      setExistingPhotos(roomDetails.roomPhotos || [])
    }
  }, [roomDetails])

  // Handle room images upload
  const handleRoomImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
      setNewPhotos((prev) => [...prev, ...newImages])
    }
  }

  // Remove new photo
  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove existing photo
  const removeExistingPhoto = (url: string) => {
    setExistingPhotos((prev) => prev.filter((photo) => photo !== url))
    setPhotosToDelete((prev) => [...prev, url])
  }

  // Add new facility field
  const addFacility = () => {
    setRoomFacilities((prev) => [...prev, ""])
  }

  // Remove facility field
  const removeFacility = (index: number) => {
    setRoomFacilities((prev) => prev.filter((_, i) => i !== index))
  }

  // Update facility value
  const updateFacility = (index: number, value: string) => {
    const updated = [...roomFacilities]
    updated[index] = value
    setRoomFacilities(updated)
  }

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!roomTitle || !roomDescription) {
      toast.error("Please fill all required fields")
      return
    }

    if (roomFacilities.some((facility) => facility.trim() === "")) {
      toast.error("Please fill all facility fields or remove empty ones")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

      // Add new photos
      newPhotos.forEach((photo) => formData.append("roomPhotos", photo))

      // Add basic room information
      formData.append("accommodation", roomDetails.accommodationId)
      formData.append("roomTitle", roomTitle)
      formData.append("roomStandard", roomStandard)
      formData.append("roomDescription", roomDescription)
      formData.append("roomFacilities", JSON.stringify(roomFacilities))

      // Add existing photos to keep
      formData.append("existingPhotos", JSON.stringify(existingPhotos))

      // Add photos to delete
      if (photosToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(photosToDelete))
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/room/edit/${roomDetails._id}`,
        formData
      )

      const data = response.data

      if (data.success) {
        toast.success(data.message || "Room updated successfully")

        // Reset photos tracking
        setPhotosToDelete([])
        setNewPhotos([])

        // Call the update callback if provided
        if (onUpdateSuccess) {
          onUpdateSuccess()
        }
      } else {
        toast.error(data.message || "Failed to update room")
      }
    } catch (error) {
      console.error(
        "Error updating room:",
        error instanceof Error ? error.message : error
      )
      toast.error("Failed to update room. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel button click
  const handleCancel = () => {
    setShowEditRoomForm(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 ">
      <div className="mb-4">
        <form onSubmit={handleUpdateRoom} className="space-y-4">
          {/* Room Images */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Room Images (max 5)<span className="text-red-700">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* new photo preview */}
              <div>
                {/* New Photos Upload */}
                <div className="mt-4">
                  <input
                    type="file"
                    onChange={handleRoomImages}
                    accept="image/*"
                    multiple
                    className="mt-2"
                    disabled={existingPhotos.length + newPhotos.length >= 5}
                  />
                  {existingPhotos.length + newPhotos.length >= 5 && (
                    <p className="text-sm italic text-red-600 mt-1">
                      Maximum number of images reached (5)
                    </p>
                  )}
                </div>
                <div>
                  {/* Newly Uploaded Images Preview */}
                  {newPhotos.length > 0 && (
                    <>
                      <h3 className="mt-4 font-medium">New Images:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {newPhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`New Room Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewPhoto(index)}
                              className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* old photo  */}
              <div>
                {/* Existing Photos */}
                {existingPhotos.length > 0 && (
                  <>
                    <h3 className="mt-2 font-medium">Current Images:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {existingPhotos.map((photoUrl, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={photoUrl}
                            alt={`Room Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingPhoto(photoUrl)}
                            className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={
                              existingPhotos.length + newPhotos.length <= 1
                            }
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Room Details */}
            <div>
              {/* Room Title */}
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Room Category <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  required
                />
              </div>

              {/* Room Standard */}
              {/* <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Room Standard <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={roomStandard}
                  onChange={(e) => setRoomStandard(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  required
                />
              </div> */}

              {/* Room Description */}
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Room Description <span className="text-red-700">*</span>
                </label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-32"
                  required
                  minLength={10}
                />
              </div>
            </div>

            {/* Room Facilities */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Room Facilities <span className="text-red-700">*</span>
              </label>
              {roomFacilities.map((facility, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => updateFacility(index, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={roomFacilities.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFacility}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Facility
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="flex justify-center items-center px-4 py-2 w-full border border-red-700 bg-red-50 text-red-700 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>

            {/* Update Room Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center px-4 py-2 w-full bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
            >
              {loading ? (
                <p className="flex gap-4">
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                  Updating...
                </p>
              ) : (
                <p>Update Room</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRoom
