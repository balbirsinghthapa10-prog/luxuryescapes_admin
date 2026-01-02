"use client"
import EditTrekForm from "@/components/trek/EditTrek"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { slug } = router
  const idSlug = Array.isArray(slug) ? slug[0] : slug || ""
  return (
    <div className="w-full">
      <EditTrekForm slug={idSlug} />{" "}
    </div>
  )
}

export default page
