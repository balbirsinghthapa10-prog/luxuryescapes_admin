"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import local from "next/font/local"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"
import Cookies from "js-cookie"

const Page = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/forgot-password`,
        {
          email,
        }
      )
      const data = response.data
      if (data.success) {
        toast.success(
          data.message ||
            "We have sent password reset instructions to your email."
        )
        Cookies.set("verifyToken", data.fpwToken)
        router.push(`/verify?t=${data.fpwToken}`)
      } else {
        Cookies.remove("verifyToken")
        toast.error(
          data.message || "Failed to send password reset instructions."
        )
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send password reset instructions."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 w-full px-5">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
        <p className="text-base text-gray-600 mt-2">
          Enter your email address to search for your account.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleEmailChange}
          className="w-full mb-5"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-between items-center gap-4 mt-6">
          <Link href="/login" className="flex-1">
            <Button
              className="w-full bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-primary text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Find Account"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
