"use client"
import React, { useEffect, useState } from "react"
import {
  Plus,
  Filter,
  MapIcon,
  SortAsc,
  Trash2,
  Star,
  MapPin,
  Video,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import ReactPlayer from "react-player"

const DestinationBannerHome: React.FC = () => {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/get-desc`
      )
      const data = response.data
      if (data.data && data.data.length > 0) {
        setBanners(data.data)
      }
    } catch (error: any) {
      console.error("Error fetching banners:", error)
      toast.error(error?.response?.data?.message || "Failed to fetch banners")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete this "${title}" banner?`))
      return

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/destination/delete-desc/${id}`
      )
      const data = response.data
      if (data.success) {
        toast.success(data.message || "Banner deleted successfully!")
        // setBanners((prev) => prev.filter((banner) => banner.id !== id))
        getData() // Refresh the banner list
      }
    } catch (error: any) {
      console.error("Error deleting banner:", error)
      toast.error(error?.response?.data?.message || "Failed to delete banner")
    }
  }

  useEffect(() => {
    getData()
  }, [sortOption])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Destination Banner Manager
          </h2>
          <Button
            onClick={() => router.push("/destination-banners/add")}
            className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Banner
          </Button>
        </div>
        <p className="text-lg text-gray-600">
          Manage destination banners for your site
        </p>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Banner Details
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.length > 0 ? (
                banners.map((banner, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          className="object-cover rounded-lg shadow-sm"
                          width={128}
                          height={96}
                        />

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {banner.title || "Untitled Banner"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {banner.description &&
                            banner.description.length > 100
                              ? `${banner.description.slice(0, 100)}...`
                              : banner.description}
                            {!banner.description && (
                              <span className="text-gray-400 italic">
                                No description provided
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            router.push(`/destination-banners/${banner.slug}`)
                          }
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleDeleteBanner(banner._id, banner.title)
                          }
                          className="px-4 py-2 rounded-lg hover:bg-red-600/90"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-12">
                    No banners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-6">
          <span className="text-gray-500">Loading banners...</span>
        </div>
      )}
    </div>
  )
}

export default DestinationBannerHome
