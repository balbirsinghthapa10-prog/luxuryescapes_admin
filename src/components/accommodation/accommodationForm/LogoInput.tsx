"use client"
import React, { useState } from "react"

import Image from "next/image"
import { Input } from "@/components/ui/input"

interface LogoInputProps {
  logo: File | null
  setLogo: React.Dispatch<React.SetStateAction<File | null>>
  logoPreview?: string | null
}

const LogoInput: React.FC<LogoInputProps> = ({
  logo,
  setLogo,
  logoPreview,
}) => {
  const [preview, setPreview] = useState<string | null>(
    logo ? URL.createObjectURL(logo) : null
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLogo(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">Logo</label>

      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
      {preview && (
        <div className="mt-2">
          <label className="block text-lg font-medium text-gray-700">
            New:
          </label>
          <img
            src={preview}
            alt="Logo Preview"
            className="h-56 w-96 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}
      {logoPreview && (
        <div className="mt-2">
          <label className="block text-lg font-medium text-gray-700">
            Current:
          </label>
          <Image
            src={logoPreview}
            alt="Logo Preview"
            width={384}
            height={384}
            className="h-56 w-96 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}
    </div>
  )
}

export default LogoInput
