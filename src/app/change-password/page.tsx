"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import Cookies from "js-cookie"

const page = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()
  // const token = useSearchParams().get("t")

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePasswords = () => {
    if (passwords.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = Cookies.get("resetToken")
      if (storedToken) {
        setToken(storedToken)
      }
    }
  }, [])

  const handleSubmit = async () => {
    setError("")
    setMessage("")

    if (!validatePasswords()) {
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/reset-password`,
        {
          password: passwords.password,
          token,
        }
      )
      const data = response.data
      if (data.success) {
        Cookies.remove("resetToken")
        toast.success(data.message || "Password changed successfully")
        router.push("/login")
      } else {
        toast.error(data.message || "Failed to change password")
        setError(data.message || "Failed to change password")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password")
      setError(err?.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    setTimeout(() => {
      setError("")
    }, 3000)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
        <p className="text-gray-600 mt-2">Enter your new password below</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div>
            <Input
              type="password"
              name="password"
              placeholder="New Password"
              value={passwords.password}
              onChange={handlePasswordChange}
              className="w-full"
            />
          </div>

          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-sm text-center mt-4">{message}</p>
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
            disabled={loading}
            className="flex-1 bg-primary text-white"
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
