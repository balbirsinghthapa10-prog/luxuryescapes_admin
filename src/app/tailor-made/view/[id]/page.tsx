"use client"
import SingleTailorMade from "@/components/QuotesAndCustomizations/SingleTailorMade"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const { id } = params as { id: string }
  return (
    <div className="w-full">
      <SingleTailorMade requestId={id} />
    </div>
  )
}

export default page
