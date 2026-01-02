"use client"
import React, { useState, useMemo, useEffect } from "react"
import {
  Search,
  ArrowLeft,
  Mail,
  Paperclip,
  X,
  CheckSquare,
  Send,
  Loader2,
  AlertCircle,
  Square,
  ChevronDown,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible"
import UserCard from "./UserCard"
import { Select } from "../ui/select"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select"

interface User {
  _id: string
  name: string
  email: string
  address: string
  country: string
}

const BulkMailing = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [users, setUsers] = useState<User[]>([])

  // New loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const router = useRouter()

  const [selectedCountry, setSelectedCountry] = useState("all")

  // Filter users based on search term and selected country
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = searchTerm
        ? user?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          user?.address?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          user?.country?.toLowerCase().includes(searchTerm?.toLowerCase())
        : true

      const matchesCountry =
        selectedCountry === "all" || user.country === selectedCountry

      return matchesSearch && matchesCountry
    })
  }, [users, searchTerm, selectedCountry])

  // Get unique countries from users
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(users.map((user) => user.country))
    ).filter(Boolean)
    return ["all", ...uniqueCountries].sort()
  }, [users])

  // Handle select all for filtered users
  const handleSelectAll = () => {
    const filteredUserIds = filteredUsers.map((user) => user._id)
    const allSelected = filteredUserIds.every((id) =>
      selectedUsers.includes(id)
    )
    if (allSelected) {
      // Deselect all filtered users
      setSelectedUsers((prev) =>
        prev.filter((id) => !filteredUserIds.includes(id))
      )
    } else {
      // Select all filtered users
      setSelectedUsers((prev) => {
        const newSelection = [...prev]
        filteredUserIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id)
          }
        })
        return newSelection
      })
    }
  }

  // Get users
  const getUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/agent/get`
      )
      const data = response.data
      if (data.success) {
        setUsers(data.data || [])
      } else {
        setError(data.message || "Failed to fetch users")
      }
    } catch (error) {
      console.error(error)
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "An error occurred"
          : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle individual user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  // Remove selected user
  const removeSelectedUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId))
  }

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      // Limit total attachments to 5
      const updatedAttachments = [...attachments, ...newFiles].slice(0, 5)
      setAttachments(updatedAttachments)
    }
  }
  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Send email handler
  const handleSendEmail = async () => {
    // Validation
    if (selectedUsers.length === 0) {
      setEmailError("Please select at least one recipient")
      return
    }

    if (!subject.trim()) {
      setEmailError("Please enter a subject")
      return
    }

    if (!message.trim()) {
      setEmailError("Please enter a message")
      return
    }

    // Reset previous email error
    setEmailError(null)
    setIsEmailSending(true)

    try {
      // Prepare form data for file upload
      const formData = new FormData()

      // Add recipient emails
      const recipients = users
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.email)

      // Add string data to form
      formData.append("emails", JSON.stringify(recipients))
      formData.append("subject", subject)
      formData.append("message", message)

      // Add attachments
      attachments.forEach((file) => {
        formData.append("attachments", file)
      })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/send-bulk-mail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send emails")
      }

      // Reset form
      setSelectedUsers([])
      setSubject("")
      setMessage("")
      setAttachments([])

      // Show success alert
      toast.success("Emails sent successfully!")
    } catch (error) {
      console.error("Email sending failed:", error)
      toast.error("Failed to send emails. Please try again.")
      setEmailError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to send emails"
          : "Failed to send emails. Please try again."
      )
    } finally {
      setIsEmailSending(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to Requests and Mails
        </Button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Mail className="mr-3 text-blue-600" /> Bulk Mailing
        </h1>

        {/* User Selection */}

        <div className="space-y-4">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex-1 text-gray-700 flex items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, or address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 ml-2 text-2xl"
                />
              </div>

              <div className="text-gray-500">
                Total selected user{" "}
                <span className="font-semibold text-primary">
                  ({selectedUsers.length > 0 ? selectedUsers.length : 0})
                </span>
              </div>
            </div>

            {/* For showing selected user name or email */}
            {selectedUsers.length > 0 && (
              <div className="flex-1 flex items-center gap-2">
                {selectedUsers.map((userId) => {
                  const user = users.find((user) => user._id === userId)
                  if (!user) return null
                  return (
                    <div
                      key={userId}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full 
                        flex items-center gap-2"
                    >
                      <span>{user.name}</span>
                      <X
                        className="w-4 h-4 cursor-pointer hover:text-red-600"
                        onClick={() => removeSelectedUser(userId)}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Country Filter */}
            <Select
              value={selectedCountry}
              onValueChange={(value) => setSelectedCountry(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country === "all" ? "All Countries" : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select All Option */}
          {filteredUsers.length > 0 && (
            <div
              className="flex items-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleSelectAll}
            >
              {filteredUsers.every((user) =>
                selectedUsers.includes(user._id)
              ) ? (
                <CheckSquare className="w-5 h-5 text-blue-600 mr-2" />
              ) : (
                <Square className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="font-medium">
                Select All Filtered Users ({filteredUsers.length})
              </span>
            </div>
          )}

          {/* User List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {selectedCountry === "all"
              ? // Group by country when showing all
                countries
                  .filter((country) => country !== "all")
                  .map((country) => {
                    const countryUsers = filteredUsers.filter(
                      (user) => user.country === country
                    )
                    if (countryUsers.length === 0) return null

                    return (
                      <Collapsible key={country} className="space-y-2">
                        <CollapsibleTrigger className="flex items-center w-full p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            {country} ({countryUsers.length})
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          {countryUsers.map((user) => (
                            <UserCard
                              key={user._id}
                              user={user}
                              isSelected={selectedUsers.includes(user._id)}
                              onToggle={() => toggleUserSelection(user._id)}
                            />
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })
              : // Show flat list when filtered by country
                filteredUsers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    isSelected={selectedUsers.includes(user._id)}
                    onToggle={() => toggleUserSelection(user._id)}
                  />
                ))}
          </div>
        </div>

        {/* Email Details */}
        <div className="space-y-4">
          {/* Email Error Alert */}
          {emailError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Error</AlertTitle>
              <AlertDescription>{emailError}</AlertDescription>
            </Alert>
          )}

          {/* Subject Input */}
          <div className="mt-8">
            <label className="block text-gray-700 font-semibold mb-2">
              Subject
            </label>
            <Input
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <Textarea
              placeholder="Compose your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Attachments (Max 5 files)
            </label>
            <div className="flex items-center">
              <Input
                type="file"
                multiple
                onChange={handleFileAttachment}
                className="w-full"
              />
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full 
                      flex items-center gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    {file.name}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-red-600"
                      onClick={() => removeAttachment(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendEmail}
            className="w-full mt-4 text-white"
            disabled={selectedUsers.length === 0 || isEmailSending}
          >
            {isEmailSending ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Sending, Please
                Wait...
              </>
            ) : (
              <>
                <Send className="mr-2" /> Send Bulk Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BulkMailing
