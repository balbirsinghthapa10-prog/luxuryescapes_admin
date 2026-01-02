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
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
// import SingleMailSend from "./SingleMailSend"
import Link from "next/link"
import MailSendForm from "../Common/MailSend"

interface RequestDetail {
  _id: string

  name: string
  email: string
  number: string
  message: string
  tourName: string
  trekname: string
  type: string
  tourId: {
    _id: string
    slug: string
    country: string
  }
  trekId: {
    _id: string
    slug: string
    country: string
  }
  status: string
  createdAt: string
}

interface SingleRequestProps {
  requestId: string
}

const SingleQuoteRequest: React.FC<SingleRequestProps> = ({ requestId }) => {
  const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null)
  const [sendMail, setSendMail] = useState<number>(0)

  const router = useRouter()

  const getSingleRequest = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/quote/specific/${requestId}`
      )
      const data = response.data
      if (data.success) {
        setRequestDetail(data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load request details")
    }
  }

  const handleChangeSendMail = (value: number) => {
    setSendMail((prev) => prev + 1)
  }

  useEffect(() => {
    getSingleRequest()
  }, [requestId, sendMail])

  if (!requestDetail) return null

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container flex gap-10 p-10">
        {/*  Header Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 w-3/5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="hover:bg-blue-700/30 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={28} />
                </button>
                {requestDetail.type === "tour" ? (
                  <span className="text-2xl">{requestDetail.tourName}</span>
                ) : (
                  <span className="text-2xl">{requestDetail.trekname}</span>
                )}
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
          <div className="p-8">
            {/* Trip Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Request Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mountain className="text-blue-600" />
                    <span>
                      <strong>Item Type:</strong>{" "}
                      <span className="font-semibold">
                        {" "}
                        {requestDetail.type}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Landmark className="text-blue-600" />
                    <span>
                      <strong>Item Name: </strong>
                      {/* <Link
                        className="text-blue-600 underline"
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_CLIENT_URL_PROD}/${requestDetail.itemType}/${requestDetail.itemSlug}`}
                      > */}
                      {requestDetail.type === "tour" ? (
                        <Link
                          className="text-blue-600 underline"
                          target="_blank"
                          href={`${
                            process.env.NEXT_PUBLIC_USER_URL_PROD
                          }/destinations/${requestDetail.tourId?.country.toLowerCase()}/${
                            requestDetail.tourId.slug
                          }`}
                        >
                          <span>{requestDetail.tourName}</span>
                        </Link>
                      ) : (
                        <Link
                          className="text-blue-600 underline"
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_USER_URL_PROD}/luxury-treks/${requestDetail.trekId.slug}`}
                        >
                          <span>{requestDetail.trekname}</span>
                        </Link>
                      )}

                      {/* </Link> */}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="text-blue-600" />
                    <span>
                      <strong>Full Name:</strong> {requestDetail.name}
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
                      <strong>Phone:</strong> {requestDetail.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Additional Information
              </h2>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <strong className="text-blue-800">Message:</strong>
                <p className="text-gray-700 mt-2">{requestDetail.message}</p>
              </div>
            </div>
          </div>
        </div>
        {/* form for mail  */}
        <MailSendForm
          id={requestDetail._id}
          email={requestDetail.email}
          name={requestDetail.name}
          onChange={handleChangeSendMail}
        />
      </div>
    </div>
  )
}

export default SingleQuoteRequest
