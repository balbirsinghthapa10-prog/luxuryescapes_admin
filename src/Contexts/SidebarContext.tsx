import { Sidebar } from "lucide-react"
import React, { createContext, useState, useContext, ReactNode } from "react"

interface SidebarData {
  tailorMade: number
  quotes: number
  bookings: number
}

interface SidebarContextType {
  sidebarData: SidebarData
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarData>>
}

// Create the context
const SidebarDataContext = createContext<SidebarContextType | undefined>(
  undefined
)

// Provider component
export const SidebarDataProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarData, setSidebarData] = useState<SidebarData>({
    tailorMade: 0,
    quotes: 0,
    bookings: 0,
  })

  return (
    <SidebarDataContext.Provider value={{ sidebarData, setSidebarData }}>
      {children}
    </SidebarDataContext.Provider>
  )
}

// Custom hook for easier usage
export const useSidebarData = () => {
  const context = useContext(SidebarDataContext)
  if (!context) {
    throw new Error("useSidebarData must be used within a SidebarDataProvider")
  }
  return context
}
