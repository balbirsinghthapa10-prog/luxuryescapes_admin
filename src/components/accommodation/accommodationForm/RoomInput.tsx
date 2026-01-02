import axios from "axios"
import { Loader2Icon } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"

interface Room {
  roomTitle: string
  roomPhotos: File[]
  roomStandard: string
  roomDescription: string
  roomFacilities: string[]
}

interface RoomInputProps {
  accommodationId: string
  onAddRoomSuccess?: () => void // Optional callback for success
}

const RoomInput: React.FC<RoomInputProps> = ({
  accommodationId,
  onAddRoomSuccess,
}) => {
  // State for the room details
  const [room, setRoom] = useState<Room>({
    roomTitle: "",
    roomPhotos: [],
    roomStandard: "",
    roomDescription: "",
    roomFacilities: [""],
  })
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (field: keyof Room, value: string | string[]) => {
    setRoom((prev) => ({ ...prev, [field]: value }))
  }

  // Handle room images upload
  const handleRoomImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
      setRoom((prev) => ({
        ...prev,
        roomPhotos: [...prev.roomPhotos, ...newImages],
      }))
    }
  }

  // Remove room image
  const removeRoomImage = (index: number) => {
    setRoom((prev) => ({
      ...prev,
      roomPhotos: prev.roomPhotos.filter((_, i) => i !== index),
    }))
  }

  // Add new facility
  const addFacility = () => {
    setRoom((prev) => ({
      ...prev,
      roomFacilities: [...prev.roomFacilities, ""],
    }))
  }

  // Remove facility
  const removeFacility = (index: number) => {
    setRoom((prev) => ({
      ...prev,
      roomFacilities: prev.roomFacilities.filter((_, i) => i !== index),
    }))
  }

  const addRoomHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      room.roomPhotos.forEach((photo) => formData.append("roomPhotos", photo))
      formData.append("accommodation", accommodationId)
      formData.append("roomTitle", room.roomTitle)
      formData.append("roomStandard", room.roomStandard)
      formData.append("roomDescription", room.roomDescription)
      formData.append("roomFacilities", JSON.stringify(room.roomFacilities))

      // Add headers to explicitly request JSON
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/room/add-room`,
        formData
      )

      const data = response.data

      if (data.success) {
        // Call the success callback if provided
        if (onAddRoomSuccess) {
          onAddRoomSuccess()
        }
        toast.success(data.message || "Room added successfully")
        // Reset the form
        setRoom({
          roomTitle: "",
          roomPhotos: [],
          roomStandard: "",
          roomDescription: "",
          roomFacilities: [""],
        })
      } else {
        toast.error(data.message || "Failed to add room")
      }
    } catch (error) {
      // Better error handling
      console.error(
        "Error adding room:",
        error instanceof Error ? error.message : error
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Room</h1>

      <div className="mb-4">
        <form onSubmit={addRoomHandler} className="space-y-4">
          {/* Room Images */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Room Images (max 4)<span className="text-red-700">*</span>
            </label>
            {room.roomPhotos.length > 0 && (
              <p className="text-sm text-gray-600 mb-2">
                {room.roomPhotos.length} image(s) selected
              </p>
            )}
            {room.roomPhotos.length >= 4 && (
              <p className="text-sm italic text-red-600 mb-2">
                cannot upload more than 4 images
              </p>
            )}
            <input
              type="file"
              onChange={handleRoomImages}
              accept="image/*"
              disabled={room.roomPhotos.length >= 4}
              multiple
              className="mt-2"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {room.roomPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Room Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeRoomImage(index)}
                    className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* Room Title */}
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Room Category <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={room.roomTitle}
                  onChange={(e) => handleChange("roomTitle", e.target.value)}
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
                  value={room.roomStandard}
                  onChange={(e) => handleChange("roomStandard", e.target.value)}
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
                  value={room.roomDescription}
                  onChange={(e) =>
                    handleChange("roomDescription", e.target.value)
                  }
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
              {room.roomFacilities.map((facility, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => {
                      const newFacilities = [...room.roomFacilities]
                      newFacilities[index] = e.target.value
                      handleChange("roomFacilities", newFacilities)
                    }}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={room.roomFacilities.length === 1}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center mt-8 px-4 py-2 w-full bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {loading ? (
              <p className="flex gap-4">
                <Loader2Icon className="h-6 w-6 animate-spin" /> Adding...
              </p>
            ) : (
              <p>Add Room</p>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RoomInput
