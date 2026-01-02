"use client"
import React, { useState } from "react"
import { ArrowLeft, Loader2Icon } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { countries } from "./AllCountries"

import { useRouter } from "next/navigation"

const AddClient = () => {
  const [formUserData, setFormUserData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
    userCountry: "",
    userCompany: "",
  })
  const [country, setCountry] = useState("")

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/agent/add`,
        {
          name: formUserData.userName,
          email: formUserData.userEmail,
          number: formUserData.userPhone,
          address: formUserData.userAddress,
          country: country.trim().toLowerCase(),
          company: formUserData.userCompany,
        },
        {
          withCredentials: true,
        }
      )

      const data = response.data
      if (data.success) {
        toast.success(data.message || "User Created Successfully")
        router.push("/clients")
      } else {
        toast.error(data.message || "Unable to Create User, Try Again")
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Unable to Create User, Try Again"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-fullp-6 md:p-8 lg:p-12 ">
      {/* Header */}
      <div className="mb-8 flex items-center gap-6">
        <button
          onClick={() => router.back()}
          className="p-3 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-7 h-7 text-gray-700" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Add Client</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white rounded-lg shadow-md border p-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Name */}
          <div className="space-y-3">
            <label
              htmlFor="userName"
              className="block text-lg font-medium text-gray-800"
            >
              Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formUserData.userName}
              required
              onChange={handleChange}
              placeholder="Enter user's name"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label
              htmlFor="userEmail"
              className="block text-lg font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formUserData.userEmail}
              onChange={handleChange}
              placeholder="Enter user's email"
              required
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
            />
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <label
              htmlFor="userPhone"
              className="block text-lg font-medium text-gray-800"
            >
              Phone
            </label>
            <input
              type="number"
              id="userPhone"
              name="userPhone"
              value={formUserData.userPhone}
              onChange={handleChange}
              placeholder="Enter user's phone number"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
            />
          </div>

          {/* Company */}
          <div className="space-y-3">
            <label
              htmlFor="userCompany"
              className="block text-lg font-medium text-gray-800"
            >
              Company
            </label>
            <input
              type="text"
              id="userCompany"
              name="userCompany"
              value={formUserData.userCompany}
              onChange={handleChange}
              required
              placeholder="Enter user's company"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
            />
          </div>

          {/* Country Selection */}
          <div className="space-y-3">
            <label
              htmlFor="userCountry"
              className="block text-lg font-medium text-gray-800"
            >
              Select Country
            </label>
            <select
              id="userCountry"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white"
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>

            <p className="text-lg font-semibold text-gray-800">
              Selected Country: <span className="text-blue-600">{country}</span>
            </p>
          </div>

          {/* Address */}
          <div className="space-y-3 md:col-span-2">
            <label
              htmlFor="userAddress"
              className="block text-lg font-medium text-gray-800"
            >
              Address
            </label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              value={formUserData.userAddress}
              onChange={handleChange}
              placeholder="Enter user's address"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-lg font-semibold flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                Adding... <Loader2Icon className="w-6 h-6 animate-spin" />
              </>
            ) : (
              "Add Client"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClient
