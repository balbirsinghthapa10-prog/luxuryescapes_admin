"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Trash2,
  Plus,
  BookOpen,
  Filter,
  ArrowUpDown,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CustomPagination } from "@/utils/Pagination"
import MainSpinner from "@/utils/MainLoader"
import axios from "axios"
import { toast } from "sonner"

type Blog = {
  _id: string
  title: string
  slug: string
  description: string
  category: {
    tourType: string
  }
  readTime: string
  thumbnail: string
  isActive: boolean
  isFeature: boolean
  createdAt: string
}

type SortField = "title" | "createdAt"
type SortOrder = "asc" | "desc"
type SortOption = {
  field: SortField
  order: SortOrder
}

interface DeleteParams {
  id: string // Adjust type as necessary
  title: string
}

const BlogHome: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [search, setSearch] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("")
  const [totalPages, setTotalPages] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const sortOptions = [
    { value: "asc", label: "Date (Oldest First)" },
    { value: "desc", label: "Date (Newest First)" },
  ]

  const getBlogHandler = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/blog/get-all?page=1&limit=10&search=${search}&filter=&sort=${sortOption}`
      )
      if (response.data.success) {
        setBlogs(response.data.data.blogs)
        setTotalPages(response.data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async ({ id, title }: DeleteParams) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${title}"?`
    )
    if (!confirmation) return
    try {
      setDeleteLoading(true)
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/blog/delete/${id}`
      )
      if (response.data.success) {
        getBlogHandler()
        toast.success(response.data.message || "Blog deleted successfully")
      } else {
        toast.error(response.data.message || "Failed to delete blog")
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.message || "Something went wrong")
    } finally {
      setDeleteLoading(false)
    }
  }

  //update visibility

  const handleUpdateVisibility = async (
    blogId: string,
    vType: string,
    status: boolean
  ) => {
    try {
      setLoading(true)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/blog/update-status/${blogId}?${vType}=${status}`
      )
      if (response.data.success) {
        getBlogHandler()
        toast.success(
          response.data.message || "Visibility updated successfully"
        )
      } else {
        toast.error(response.data.message || "Failed to update visibility")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      getBlogHandler()
    }, 1000)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    getBlogHandler()
  }, [category, sortOption])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Blog Manager
          </h2>
          <div className="flex gap-6">
            <Button
              onClick={() => router.push("/blogs/add-blog")}
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Blog
            </Button>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          Manage and curate your blog content efficiently
        </p>
      </div>

      {/* Filters Section */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown
              className="absolute left-3 top-2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Blog Details ({blogs.length})
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <span>Visibility</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {blogs &&
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={blog.thumbnail || "/going.png"}
                          alt={blog.title}
                          className=" object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-lg">
                            {blog.title}
                          </h3>

                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Filter size={10} className="mr-1" />
                              {blog.category?.tourType}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock size={10} className="mr-1" />
                              {blog.readTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="flex flex-col gap-4 justify-center items-center px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              blog.isActive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {blog.isActive ? "Active" : "Inactive"}
                          </span>
                          <Switch
                            checked={blog.isActive}
                            onCheckedChange={() =>
                              handleUpdateVisibility(
                                blog._id,
                                "isActive",
                                !blog.isActive
                              )
                            }
                          />
                        </div>
                      </div>
                      {/* featured  */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              blog.isFeature ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {blog.isFeature ? "Featured" : "Not Featured"}
                          </span>
                          <Switch
                            checked={blog.isFeature}
                            onCheckedChange={() =>
                              handleUpdateVisibility(
                                blog._id,
                                "isFeature",
                                !blog.isFeature
                              )
                            }
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            router.push(`/blogs/edit-blog/${blog.slug}`)
                          }
                          disabled={deleteLoading || loading}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleDelete({ id: blog._id, title: blog.title })
                          }}
                          disabled={deleteLoading || loading}
                          className="px-4 py-2 rounded-lg hover:bg-red-600/90"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Loading and Empty States */}
      {loading && (
        <div className="flex justify-center">
          <MainSpinner />
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No blogs found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {blogs.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  )
}

export default BlogHome
