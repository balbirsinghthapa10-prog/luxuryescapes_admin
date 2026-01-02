"use client"
import EditDestinationBanner from "@/components/Banners/EditDestinationBanner"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const { id } = params as { id: string }
  return (
    <div className="w-full">
      <EditDestinationBanner slug={id} />
    </div>
  )
}

export default page
