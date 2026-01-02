"use client"

import EditTourForm from "@/components/tours/EditTour"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { slug } = router
  const idSlug = Array.isArray(slug) ? slug[0] : slug || ""
  return (
    <div className="w-full">
      <EditTourForm slug={idSlug} />
    </div>
  )
}

export default page
