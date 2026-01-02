"use client"

import EditBlogForm from "@/components/Blog/EditBlogForm"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { slug } = router
  const slugString = Array.isArray(slug) ? slug[0] : slug || ""

  return (
    <div className="w-full">
      <EditBlogForm slug={slugString} />
    </div>
  )
}

export default page
