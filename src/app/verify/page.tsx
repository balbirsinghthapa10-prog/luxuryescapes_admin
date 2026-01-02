"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import Cookies from "js-cookie"
const page = () => {
  const router = useRouter()

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = Cookies.get("verifyToken")
      if (storedToken) {
        setToken(storedToken)
      }
    }
  }, [])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "") // Only allow numbers
    if (value.length <= 4) {
      // Limit to 4 digits
      setOtp(value)
    }
  }

  const handleSubmit = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP")
      return
    }

    if (!token) {
      setError("Invalid token. Please try again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/verify-otp?fpwToken=${token}`,
        {
          otp,
        }
      )
      const data = response.data
      if (data.success) {
        Cookies.remove("verifyToken")
        Cookies.set("resetToken", data.token)

        toast.success(data.message || "Account verified successfully")
        router.push(`/change-password?t=${data.token}`)
      } else {
        toast.error(data.message || "Failed to verify account")
        setError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to verify account")
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-gray-600 mt-2">
          Enter the 4-digit code sent to your email
        </p>
        <p className="text-gray-500">otp will expire in 10 minutes</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={4}
            pattern="\d*"
            value={otp}
            onChange={handleOtpChange}
            placeholder="4-digit OTP"
            className="text-center text-5xl font-bold tracking-widest h-14"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-sm text-center mb-4">{message}</p>
        )}

        <div className="flex justify-between gap-4 mt-6">
          <Link href="/login" className="flex-1">
            <Button
              className="w-full bg-gray-400 text-white hover:bg-gray-500"
              disabled={loading}
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={loading || !token}
            className="flex-1 bg-primary text-white"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
