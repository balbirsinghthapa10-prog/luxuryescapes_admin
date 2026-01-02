"use client"
import React, { useState, useEffect } from "react"
import {
  User,
  Camera,
  Lock,
  Shield,
  Clock,
  Network,
  Key,
  FileText,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  AlarmClock,
  Youtube,
} from "lucide-react"

import axios from "axios"
import Cookies from "js-cookie"
import { sessionData } from "../Types/Types"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// Type definitions for the profile data
interface SecurityQuestion {
  question: string
  answer: string
}

interface ProfileData {
  name: string
  email: string
  phone: string | null
  role: "Admin" | "Moderator"
  isActive: boolean
  isSuspended: boolean
  lastLoginAt: string | null
  lastLoginIP: string | null
  failedLoginAttempts: number
  twoFactorEnabled: boolean
  securityQuestions: SecurityQuestion[]
  oneTimePassword: number | null
  refreshToken: string | null
  createdAt: string
  updatedAt: string
  profilePicture: string | null
  location: string | null
  contactNumbers: string[]
  contactEmails: string[]
  facebookLink: string | null
  twitterLink: string | null
  instagramLink: string | null
  youtubeLink: string | null
  linkedInLink: string | null
  officeTimeStart: string | null
  officeTimeEnd: string | null
  otherWebsites: string[]
}

interface PasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

import { toast } from "sonner"

const MyProfile: React.FC = () => {
  const router = useRouter()
  const [hideView, setHideView] = useState<Boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false)

  // Password state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Initial state with more robust default values
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "N/A",
    email: "N/A",
    phone: null,
    role: "Admin",
    isActive: false,
    isSuspended: false,
    lastLoginAt: null,
    lastLoginIP: null,
    failedLoginAttempts: 0,
    twoFactorEnabled: false,
    securityQuestions: [
      { question: "What is your favourite movie?", answer: "" },
      { question: "What was your first pet's name?", answer: "" },
    ],
    oneTimePassword: null,
    refreshToken: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profilePicture: null,
    location: null,
    contactNumbers: [],
    contactEmails: [],
    facebookLink: null,
    twitterLink: null,
    instagramLink: null,
    linkedInLink: null,
    youtubeLink: null,
    officeTimeStart: null,
    officeTimeEnd: null,
    otherWebsites: [],
  })

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as sessionData

  const userId = session?.user?.id

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/profile/get/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.data.success) {
        // Merge response data with default state to ensure all fields are present
        setProfileData((prevData) => ({
          ...prevData,
          ...response.data.data,
          securityQuestions: response.data.data.securityQuestions?.length
            ? response.data.data.securityQuestions
            : prevData.securityQuestions,
          contactNumbers: response.data.data.contactNumbers || [],
          contactEmails: response.data.data.contactEmails || [],
          otherWebsites: response.data.data.otherWebsites || [],
        }))
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle array items (contactNumbers, contactEmails, otherWebsites)
  const handleArrayItemChange = (
    array: string[],
    index: number,
    value: string,
    arrayName: string
  ) => {
    const newArray = [...array]
    newArray[index] = value
    setProfileData((prev) => ({
      ...prev,
      [arrayName]: newArray,
    }))
  }

  const addArrayItem = (array: string[], arrayName: string) => {
    setProfileData((prev) => ({
      ...prev,
      [arrayName]: [...array, ""],
    }))
  }

  const removeArrayItem = (
    array: string[],
    index: number,
    arrayName: string
  ) => {
    const newArray = [...array]
    newArray.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      [arrayName]: newArray,
    }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/profile/edit/${userId}`,
        {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          contactNumbers: profileData.contactNumbers,
          contactEmails: profileData.contactEmails,
          facebookLink: profileData.facebookLink,
          twitterLink: profileData.twitterLink,
          instagramLink: profileData.instagramLink,
          linkedInLink: profileData.linkedInLink,
          youtubeLink: profileData.youtubeLink,
          officeTimeStart: profileData.officeTimeStart,
          officeTimeEnd: profileData.officeTimeEnd,
          otherWebsites: profileData.otherWebsites,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.success) {
        // Refresh profile data
        getUserProfile()
        toast.success("Profile updated successfully")
      } else {
        toast.error(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An error occurred while updating your profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsUpdatingPassword(true)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/profile/edit/${userId}`,
        {
          oldPassword: passwordData.oldPassword,
          password: passwordData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.success) {
        toast.success("Password updated successfully")
        // Clear password fields
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast.error(response.data.message || "Failed to update password")
      }
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while updating your password"
      )
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  useEffect(() => {
    if (userId) {
      getUserProfile()
    }
  }, [userId])

  return (
    <div className="w-full bg-gray-100 p-6">
      <div className=" mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex justify-center items-center gap-4">
            <div>
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary" />
                )}
              </div>
            </div>
            <div className="">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-blue-200">{profileData.role}</p>
            </div>
          </div>
          <div>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="text-white bg-green-600 font-semibold px-4 py-2 rounded-full shadow-md flex items-center"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <User className="mr-2 text-gray-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className=" text-gray-700 font-medium mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <Shield className="mr-2 text-gray-600" />
                Account Security
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <Phone className="mr-2 text-gray-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                {/* Contact Numbers */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-medium">
                      Contact Numbers
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem(
                          profileData.contactNumbers,
                          "contactNumbers"
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Number
                    </button>
                  </div>
                  {profileData.contactNumbers.length === 0 ? (
                    <div className="text-gray-500 text-sm italic mb-2">
                      No contact numbers added
                    </div>
                  ) : (
                    profileData.contactNumbers.map((number, index) => (
                      <div key={`number-${index}`} className="flex mb-2">
                        <input
                          type="tel"
                          value={number}
                          onChange={(e) =>
                            handleArrayItemChange(
                              profileData.contactNumbers,
                              index,
                              e.target.value,
                              "contactNumbers"
                            )
                          }
                          className="flex-grow px-3 py-2 border rounded-l-md"
                          placeholder="Enter contact number"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              profileData.contactNumbers,
                              index,
                              "contactNumbers"
                            )
                          }
                          className="bg-red-500 text-white px-3 py-2 rounded-r-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Contact Emails */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-medium">
                      Contact Emails
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem(profileData.contactEmails, "contactEmails")
                      }
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Email
                    </button>
                  </div>
                  {profileData.contactEmails.length === 0 ? (
                    <div className="text-gray-500 text-sm italic mb-2">
                      No contact emails added
                    </div>
                  ) : (
                    profileData.contactEmails.map((email, index) => (
                      <div key={`email-${index}`} className="flex mb-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            handleArrayItemChange(
                              profileData.contactEmails,
                              index,
                              e.target.value,
                              "contactEmails"
                            )
                          }
                          className="flex-grow px-3 py-2 border rounded-l-md"
                          placeholder="Enter contact email"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              profileData.contactEmails,
                              index,
                              "contactEmails"
                            )
                          }
                          className="bg-red-500 text-white px-3 py-2 rounded-r-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <Network className="mr-2 text-gray-600" />
                Social Media
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Facebook className="w-4 h-4 mr-1 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebookLink"
                    value={profileData.facebookLink || ""}
                    onChange={handleInputChange}
                    placeholder="Facebook profile URL"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Twitter className="w-4 h-4 mr-1 text-blue-400" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitterLink"
                    value={profileData.twitterLink || ""}
                    onChange={handleInputChange}
                    placeholder="Twitter profile URL"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Instagram className="w-4 h-4 mr-1 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={profileData.instagramLink || ""}
                    onChange={handleInputChange}
                    placeholder="Instagram profile URL"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Linkedin className="w-4 h-4 mr-1 text-blue-700" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedInLink"
                    value={profileData.linkedInLink || ""}
                    onChange={handleInputChange}
                    placeholder="LinkedIn profile URL"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Youtube className="w-4 h-4 mr-1 text-red-700" />
                    Youtube
                  </label>
                  <input
                    type="url"
                    name="youtubeLink"
                    value={profileData.youtubeLink || ""}
                    onChange={handleInputChange}
                    placeholder="LinkedIn profile URL"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <FileText className="mr-2 text-gray-600" />
                Additional Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <AlarmClock className="w-4 h-4 mr-1" />
                      Office Hours Start
                    </label>
                    <input
                      type="time"
                      name="officeTimeStart"
                      value={profileData.officeTimeStart || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <AlarmClock className="w-4 h-4 mr-1" />
                      Office Hours End
                    </label>
                    <input
                      type="time"
                      name="officeTimeEnd"
                      value={profileData.officeTimeEnd || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Other Websites */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-medium flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      Other Websites
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem(profileData.otherWebsites, "otherWebsites")
                      }
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Website
                    </button>
                  </div>
                  {profileData.otherWebsites.length === 0 ? (
                    <div className="text-gray-500 text-sm italic mb-2">
                      No websites added
                    </div>
                  ) : (
                    profileData.otherWebsites.map((website, index) => (
                      <div key={`website-${index}`} className="flex mb-2">
                        <input
                          type="url"
                          value={website}
                          onChange={(e) =>
                            handleArrayItemChange(
                              profileData.otherWebsites,
                              index,
                              e.target.value,
                              "otherWebsites"
                            )
                          }
                          className="flex-grow px-3 py-2 border rounded-l-md"
                          placeholder="Enter website URL"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              profileData.otherWebsites,
                              index,
                              "otherWebsites"
                            )
                          }
                          className="bg-red-500 text-white px-3 py-2 rounded-r-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10  mb-10 justify-center flex items-center">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="text-white text-md w-72 bg-green-600 font-semibold px-8 py-4 rounded-full shadow-md flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 w-6 h-6 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 w-6 h-6" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
