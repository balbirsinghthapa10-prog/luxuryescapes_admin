"use client"
import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import {
  Calendar,
  Map,
  MessageSquare,
  Users,
  Hotel,
  Globe,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useSidebarData } from "@/Contexts/SidebarContext"

interface DashboardData {
  tourCount: number
  trekCount: number
  accommodationCount: number
  blogCount: number
  recentTailormade: TailormadeRequest[]
  recentInquiries: Inquiry[]
}

interface TailormadeRequest {
  _id: string
  email: string
  country: string
  experienceLevel: string
  budget: string
  status: string
  createdAt: string
  name?: string
}

interface Inquiry {
  _id: string
  name: string
  email: string
  tourName: string
  trekName: string
  type: string
  tourId: string | null
  trekId: string | null
  status: string
  createdAt: string
}

export default function Dashboard() {
  const [dashboardContent, setDashboardContent] = useState<DashboardData | {}>(
    {}
  )
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()
  const { setSidebarData } = useSidebarData()

  const handleGetDashboardContent = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/dashboard`
      )
      const data = response.data
      if (data.success) {
        setDashboardContent(data.data)
        const sidebarData = {
          tailorMade: data.data.tailerMade || 0,
          quotes: data.data.quotes || 0,
          bookings: data.data.bookings || 0,
        }
        setSidebarData(sidebarData)
      } else {
        setDashboardContent({})
      }
    } catch (error) {
      console.error("Error fetching dashboard content:", error)
      setDashboardContent({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetDashboardContent()
  }, [])

  // Type guard to check if dashboardContent has the correct type
  const isDashboardData = (data: any): data is DashboardData => {
    return (
      data &&
      typeof data.tourCount === "number" &&
      typeof data.trekCount === "number" &&
      Array.isArray(data.recentTailormade) &&
      Array.isArray(data.recentInquiries)
    )
  }

  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome, {session?.user?.name}!
              </h1>
              <p className="text-gray-500 mt-1">
                Here's what's happening with your travel business today
              </p>
            </div>
          </div>
          <div>
            {loading && (
              <div className="animate-pulse flex flex-col items-center mb-6">
                Loading your Luxury Experience, Please wait...
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Active Tours
                </CardTitle>
                <div className="bg-blue-50 p-2 rounded-full">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isDashboardData(dashboardContent)
                    ? dashboardContent.tourCount
                    : "-"}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Active Treks
                </CardTitle>
                <div className="bg-green-50 p-2 rounded-full">
                  <Map className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isDashboardData(dashboardContent)
                    ? dashboardContent.trekCount
                    : "-"}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Accommodations
                </CardTitle>
                <div className="bg-purple-50 p-2 rounded-full">
                  <Hotel className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isDashboardData(dashboardContent)
                    ? dashboardContent.accommodationCount
                    : "-"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tailormade Requests */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Tailormade Requests</CardTitle>
              </div>
              <CardDescription>
                Custom travel packages requested by clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {isDashboardData(dashboardContent) &&
                  dashboardContent.recentTailormade.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {request.name || request.email}
                          </h3>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-1 mr-2">
                              {request.country}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1 mr-2">
                              {request.experienceLevel}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                              {request.budget}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="mb-2">
                          {request.status === "pending" && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              Pending
                            </Badge>
                          )}
                          {request.status === "viewed" && (
                            <Badge className="bg-blue-500 hover:bg-blue-600">
                              Viewed
                            </Badge>
                          )}
                          {request.status === "processing" && (
                            <Badge className="bg-indigo-500 hover:bg-indigo-600">
                              Processing
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                {(!isDashboardData(dashboardContent) ||
                  dashboardContent.recentTailormade.length === 0) && (
                  <div className="text-center py-6 text-gray-500">
                    No recent tailormade requests to display
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/tailor-made"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View all tailormade requests →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Treks & Tours Tabs */}
          <Tabs defaultValue="treks" className="space-y-4 mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="tours" className="text-lg">
                Tour Inquiries
              </TabsTrigger>
              <TabsTrigger value="treks" className="text-lg">
                Trek Inquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tours">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Tour Inquiries</CardTitle>
                  </div>
                  <CardDescription>
                    Most requested tour packages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isDashboardData(dashboardContent) &&
                      dashboardContent.recentInquiries
                        .filter((item) => item.type === "tour")
                        .map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                <Globe className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{item.tourName}</p>
                                <p className="text-sm text-gray-500">
                                  {item.name} • {item.email}
                                </p>
                                <div className="text-xs text-gray-400 mt-1">
                                  Inquiry date: {formatDate(item.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    {(!isDashboardData(dashboardContent) ||
                      !dashboardContent.recentInquiries.some(
                        (item) => item.type === "tour"
                      )) && (
                      <div className="text-center py-6 text-gray-500">
                        No recent tour inquiries to display
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="/quotes"
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View all requests →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treks">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Trek Inquiries</CardTitle>
                  </div>
                  <CardDescription>
                    Most requested trek packages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isDashboardData(dashboardContent) &&
                      dashboardContent.recentInquiries
                        .filter((item) => item.type === "trek")
                        .map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                <Map className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {item.trekName || item.tourName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.name} • {item.email}
                                </p>
                                <div className="text-xs text-gray-400 mt-1">
                                  Inquiry date: {formatDate(item.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    {(!isDashboardData(dashboardContent) ||
                      !dashboardContent.recentInquiries.some(
                        (item) => item.type === "trek"
                      )) && (
                      <div className="text-center py-6 text-gray-500">
                        No recent trek inquiries to display
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="/quotes"
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View all requests →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
