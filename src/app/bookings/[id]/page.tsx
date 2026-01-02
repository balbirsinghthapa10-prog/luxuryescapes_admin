"use client"
import SingleBookingView from "@/components/Bookings/SingleBookingView"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const { id } = params as { id: string }
  return (
    <div className="w-full">
      <SingleBookingView id={id} />
    </div>
  )
}

export default page
