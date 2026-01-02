"use client"
import EditHomeBanner from "@/components/Banners/EditHomeBanner"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const { id } = params as { id: string }
  return (
    <div>
      <EditHomeBanner bannerId={id} />
    </div>
  )
}

export default page
