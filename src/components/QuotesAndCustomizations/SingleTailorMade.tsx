"use client"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Mail,
  Phone,
  Globe,
  Landmark,
  DollarSign,
  User,
  Mountain,
  Utensils,
  Send,
  ArrowLeft,
  Clock,
  Plane,
  Hotel,
  Coffee,
  Flag,
  Heart,
  Award,
  Briefcase,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MailSendForm from "../Common/MailSend"
import MailSendTailorMade from "./SendSingleMailTailorMade"

interface TailorMadeRequest {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  dreamDestination: string[]
  fixedDates: {
    arrival: string
    departure: string
  } | null
  flexibleDates: string | null
  travelers: {
    adults: number
    children: number
  }
  travelDuration: number
  experienceLevel: string
  hotelStandard: string
  hotelBrandPreference: string
  transportationPreferences: string[]
  mealPreferences: string
  budget: string
  dreamExperience: string
  status: string
  createdAt: string
  updatedAt: string
}

interface SingleTailorMadeProps {
  requestId: string
}

const SingleTailorMade: React.FC<SingleTailorMadeProps> = ({ requestId }) => {
  const [requestDetail, setRequestDetail] = useState<TailorMadeRequest | null>(
    null
  )
  const [sendMail, setSendMail] = useState<number>(0)

  const router = useRouter()

  const getSingleTailorMade = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/tailor-made/specific/${requestId}`
      )
      const data = response.data
      if (data.success) {
        setRequestDetail(data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load tailor-made request details")
    }
  }

  const handleChangeSendMail = (value: number) => {
    setSendMail((prev) => prev + 1)
  }

  useEffect(() => {
    getSingleTailorMade()
  }, [requestId, sendMail])

  if (!requestDetail) return null

  // Calculate trip duration in days
  const calculateDuration = () => {
    if (requestDetail.fixedDates) {
      const arrival = new Date(requestDetail.fixedDates.arrival)
      const departure = new Date(requestDetail.fixedDates.departure)
      const diffTime = Math.abs(departure.getTime() - arrival.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return requestDetail.travelDuration || "N/A"
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container flex flex-col md:flex-row gap-6 p-6 md:p-10">
        {/*  Header Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="hover:bg-blue-700/30 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={28} />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    Tailor-Made Trip Request
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Submitted on{" "}
                    {new Date(requestDetail.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    requestDetail.status === "pending"
                      ? "bg-orange-600"
                      : requestDetail.status === "viewed"
                      ? "bg-green-600"
                      : "bg-blue-600"
                  }`}
                >
                  {requestDetail.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            {/* Trip Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column - Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="text-blue-600" />
                    <span>
                      <strong>Full Name:</strong> {requestDetail.firstName}{" "}
                      {requestDetail.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-blue-600" />
                    <span>
                      <strong>Email:</strong> {requestDetail.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-blue-600" />
                    <span>
                      <strong>Phone:</strong> {requestDetail.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Flag className="text-blue-600" />
                    <span>
                      <strong>Country:</strong> {requestDetail.country}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8 border-b pb-2">
                  Travel Party
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Users className="text-blue-600" />
                    <span>
                      <strong>Travelers:</strong>{" "}
                      {requestDetail.travelers.adults} Adults,{" "}
                      {requestDetail.travelers.children} Children
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Trip Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Trip Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="text-blue-600" />
                    <span>
                      <strong>Dream Destination:</strong>{" "}
                      {requestDetail.dreamDestination.join(", ")}
                    </span>
                  </div>

                  {requestDetail.fixedDates ? (
                    <div className="flex items-center gap-4">
                      <Calendar className="text-blue-600" />
                      <span>
                        <strong>Fixed Dates:</strong>{" "}
                        {new Date(
                          requestDetail.fixedDates.arrival
                        ).toLocaleDateString()}{" "}
                        to{" "}
                        {new Date(
                          requestDetail.fixedDates.departure
                        ).toLocaleDateString()}
                        <span className="ml-2 text-blue-600">
                          ({calculateDuration()} days)
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Clock className="text-blue-600" />
                      <span>
                        <strong>Flexible Dates:</strong>{" "}
                        {requestDetail.flexibleDates || "Not specified"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Award className="text-blue-600" />
                    <span>
                      <strong>Experience Level:</strong>{" "}
                      {requestDetail.experienceLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Hotel className="text-blue-600" />
                    <span>
                      <strong>Hotel Standard:</strong>{" "}
                      {requestDetail.hotelStandard}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Briefcase className="text-blue-600" />
                    <span>
                      <strong>Hotel Brand Preference:</strong>{" "}
                      {requestDetail.hotelBrandPreference}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Plane className="text-blue-600" />
                    <span>
                      <strong>Transportation:</strong>{" "}
                      {requestDetail.transportationPreferences.join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Utensils className="text-blue-600" />
                    <span>
                      <strong>Meal Preferences:</strong>{" "}
                      {requestDetail.mealPreferences}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <DollarSign className="text-blue-600" />
                    <span>
                      <strong>Budget:</strong> {requestDetail.budget}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dream Experience */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Dream Experience
              </h2>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-700">
                  {requestDetail.dreamExperience ||
                    "No specific dream experience provided."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form for mail */}
        <div className="md:w-2/4">
          <MailSendTailorMade
            id={requestDetail._id}
            email={requestDetail.email}
            name={`${requestDetail.firstName} ${requestDetail.lastName}`}
            onChange={handleChangeSendMail}
          />
        </div>
      </div>
    </div>
  )
}

export default SingleTailorMade
