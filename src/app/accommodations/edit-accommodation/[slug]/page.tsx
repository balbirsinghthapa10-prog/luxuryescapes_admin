"use client"
import EditAccommodation from "@/components/accommodation/EditAccommodation"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const slugId = useParams()
  const slug = `${slugId.slug}`
  return (
    <div className="w-full">
      <EditAccommodation slug={slug} />
    </div>
  )
}

export default page
