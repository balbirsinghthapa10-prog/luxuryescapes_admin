"use client"
import React, { useState, useEffect } from "react"
import { Plus, Minus, Save, X } from "lucide-react"

interface AboutData {
  aboutText: string
  aboutImage: string
  specializationText: string[]
  mission: string[]
  specializationImage: string
}

interface AboutResponse extends AboutData {
  _id?: string
  id?: string
}

interface ApiResponse {
  _id?: string
  id?: string
  message?: string
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
    aboutText: "",
    aboutImage: "",
    specializationText: [""],
    mission: [""],
    specializationImage: "",
  })

  // Store actual file objects for binary upload
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null)
  const [specializationImageFile, setSpecializationImageFile] =
    useState<File | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [aboutId, setAboutId] = useState<string | null>(null)

  // Fetch existing data on component mount
  useEffect(() => {
    fetchAboutData()
  }, [])

  // Helper function to parse JSON strings or return array
  const parseArrayField = (field: any): string[] => {
    if (!field) return [""]

    if (Array.isArray(field)) {
      // Handle array of strings or array with JSON strings
      const parsed = field
        .map((item) => {
          if (typeof item === "string" && item.startsWith("[")) {
            try {
              const parsedItem = JSON.parse(item)
              return Array.isArray(parsedItem) ? parsedItem : [item]
            } catch {
              return [item]
            }
          }
          return item
        })
        .flat()
        .filter((item) => item !== null && item !== undefined && item !== "")

      return parsed.length > 0 ? parsed : [""]
    }

    return [""]
  }

  const fetchAboutData = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/about/get`
      )
      const json = await response.json()

      if (json.success && json.data && json.data.length > 0) {
        const data = json.data[0]

        // Check if meaningful data exists
        const hasData =
          data._id &&
          (data.aboutText ||
            data.aboutImage ||
            data.specializationImage ||
            (data.specializationText && data.specializationText.length > 0) ||
            (data.mission &&
              data.mission.some((m: any) => m !== null && m !== undefined)))

        if (hasData) {
          setAboutData({
            aboutText: data.aboutText || "",
            aboutImage: data.aboutImage || "",
            specializationText: parseArrayField(data.specializationText),
            mission: parseArrayField(data.mission),
            specializationImage: data.specializationImage || "",
          })
          setIsEditing(true)
          setAboutId(data._id || data.id || null)
        } else {
          // No meaningful data - set to add mode
          setIsEditing(false)
          setAboutId(null)
          setAboutData({
            aboutText: "",
            aboutImage: "",
            specializationText: [""],
            mission: [""],
            specializationImage: "",
          })
        }
      } else {
        // No data exists - set to add mode
        setIsEditing(false)
        setAboutId(null)
        setAboutData({
          aboutText: "",
          aboutImage: "",
          specializationText: [""],
          mission: [""],
          specializationImage: "",
        })
      }
    } catch (err) {
      setError("Failed to fetch about data")
      // On error, default to add mode
      setIsEditing(false)
      setAboutId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AboutData, value: string): void => {
    setAboutData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSpecializationChange = (index: number, value: string): void => {
    const newSpecializations = [...aboutData.specializationText]
    newSpecializations[index] = value
    setAboutData((prev) => ({
      ...prev,
      specializationText: newSpecializations,
    }))
  }

  const addSpecialization = (): void => {
    setAboutData((prev) => ({
      ...prev,
      specializationText: [...prev.specializationText, ""],
    }))
  }

  const removeSpecialization = (index: number): void => {
    if (aboutData.specializationText.length > 1) {
      const newSpecializations = aboutData.specializationText.filter(
        (_, i) => i !== index
      )
      setAboutData((prev) => ({
        ...prev,
        specializationText: newSpecializations,
      }))
    }
  }

  const handleMissionChange = (index: number, value: string): void => {
    const newMissions = [...aboutData.mission]
    newMissions[index] = value
    setAboutData((prev) => ({
      ...prev,
      mission: newMissions,
    }))
  }

  const addMission = (): void => {
    setAboutData((prev) => ({
      ...prev,
      mission: [...prev.mission, ""],
    }))
  }

  const removeMission = (index: number): void => {
    if (aboutData.mission.length > 1) {
      const newMissions = aboutData.mission.filter((_, i) => i !== index)
      setAboutData((prev) => ({
        ...prev,
        mission: newMissions,
      }))
    }
  }

  const handleImageUpload = (
    field: "aboutImage" | "specializationImage",
    file: File | null
  ): void => {
    if (file) {
      // Store the file object for binary upload
      if (field === "aboutImage") {
        setAboutImageFile(file)
      } else {
        setSpecializationImageFile(file)
      }

      // Create preview URL for display
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          handleInputChange(field, e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (field: "aboutImage" | "specializationImage"): void => {
    handleInputChange(field, "")
    if (field === "aboutImage") {
      setAboutImageFile(null)
    } else {
      setSpecializationImageFile(null)
    }
  }

  const handleSubmitWithFormData = async (): Promise<void> => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Filter out empty specialization texts and missions
      const filteredSpecializations = aboutData.specializationText.filter(
        (text) => text.trim() !== ""
      )
      const filteredMissions = aboutData.mission.filter(
        (text) => text.trim() !== ""
      )

      const formData = new FormData()
      formData.append("aboutText", aboutData.aboutText)
      formData.append(
        "specializationText",
        JSON.stringify(filteredSpecializations)
      )
      formData.append("mission", JSON.stringify(filteredMissions))

      // Add image files if they exist
      if (aboutImageFile) {
        formData.append("aboutImage", aboutImageFile)
      }
      if (specializationImageFile) {
        formData.append("specializationImage", specializationImageFile)
      }

      let response: Response
      if (isEditing && aboutId) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/about/edit/${aboutId}`,
          {
            method: "PATCH",
            body: formData,
          }
        )
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/about/add`,
          {
            method: "POST",
            body: formData,
          }
        )
      }

      if (response.ok) {
        const result: ApiResponse = await response.json()
        setSuccess(
          isEditing
            ? "About data updated successfully!"
            : "About data added successfully!"
        )
        if (!isEditing) {
          setIsEditing(true)
          setAboutId(result._id || result.id || null)
        }
        // Refresh data after successful submission
        setTimeout(() => {
          fetchAboutData()
        }, 1000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || "Failed to save about data")
      }
    } catch (err) {
      setError("An error occurred while saving")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = handleSubmitWithFormData

  const clearMessages = (): void => {
    setError("")
    setSuccess("")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          About Page Management
        </h1>
        <p className="text-gray-600">
          Manage your about section content and specializations
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-700">{error}</span>
          <button
            onClick={clearMessages}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-700">{success}</span>
          <button
            onClick={clearMessages}
            className="text-green-500 hover:text-green-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* About Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Text
          </label>
          <textarea
            value={aboutData.aboutText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange("aboutText", e.target.value)
            }
            placeholder="Enter about text..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            rows={6}
          />
        </div>

        {/* About Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Image
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImageUpload("aboutImage", e.target.files?.[0] || null)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {aboutImageFile && (
              <div className="text-sm text-gray-600">
                Selected file: {aboutImageFile.name} (
                {Math.round(aboutImageFile.size / 1024)}KB)
              </div>
            )}
            {aboutData.aboutImage && (
              <div className="relative inline-block">
                <img
                  src={aboutData.aboutImage}
                  alt="About preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage("aboutImage")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Specialization Texts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Specialization Texts
            </label>
            <button
              type="button"
              onClick={addSpecialization}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Specialization
            </button>
          </div>

          <div className="space-y-3">
            {aboutData.specializationText.map((text: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSpecializationChange(index, e.target.value)
                  }
                  placeholder={`Specialization ${index + 1}...`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {aboutData.specializationText.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specialization Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization Image
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImageUpload(
                  "specializationImage",
                  e.target.files?.[0] || null
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {specializationImageFile && (
              <div className="text-sm text-gray-600">
                Selected file: {specializationImageFile.name} (
                {Math.round(specializationImageFile.size / 1024)}KB)
              </div>
            )}
            {aboutData.specializationImage && (
              <div className="relative inline-block">
                <img
                  src={aboutData.specializationImage}
                  alt="Specialization preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage("specializationImage")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mission Texts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Mission Texts
            </label>
            <button
              type="button"
              onClick={addMission}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Mission
            </button>
          </div>

          <div className="space-y-3">
            {aboutData.mission.map((text: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMissionChange(index, e.target.value)
                  }
                  placeholder={`Mission ${index + 1}...`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {aboutData.mission.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMission(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving..." : isEditing ? "Update About" : "Save About"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default About
