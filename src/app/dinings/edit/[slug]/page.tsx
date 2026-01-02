"use client"

import EditDining from "@/components/FineDining/EditDining"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const slugId = useParams()
  const slug = `${slugId.slug}`
  return (
    <div className="w-full">
      <EditDining slug={slug} />
    </div>
  )
}

export default page
