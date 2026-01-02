"use client"
import EditDestination from "@/components/Destinations/EditDestination"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { id } = router
  const slugString = Array.isArray(id) ? id[0] : id || ""

  const params = { id: slugString }
  return (
    <div className="w-full">
      <EditDestination params={params} />
    </div>
  )
}

export default page
