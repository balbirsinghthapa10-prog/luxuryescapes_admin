"use client"
import SingleQuoteRequest from "@/components/QuotesAndCustomizations/SingleQuote"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { id } = router
  const slugString = Array.isArray(id) ? id[0] : id || ""

  return (
    <div>
      <SingleQuoteRequest requestId={slugString} />
    </div>
  )
}

export default page
