"use client"
import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
  useContext,
} from "react"

// Define the interface for admin details
interface AdminDetails {
  adminInfo: {
    _id: string
    fullName: string
    email: string
  }
  setAdminInfo: Dispatch<
    SetStateAction<{
      _id: string
      fullName: string
      email: string
    }>
  >
}

// Create the context with a default value
const AdminDetailsContext = createContext<AdminDetails | undefined>(undefined)

// Provider component
interface AdminDetailsProviderProps {
  children: ReactNode
}

const AdminDetailsProvider: FC<AdminDetailsProviderProps> = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState<{
    _id: string
    fullName: string
    email: string
  }>({
    _id: "",
    fullName: "",
    email: "",
  })

  return (
    <AdminDetailsContext.Provider value={{ adminInfo, setAdminInfo }}>
      {children}
    </AdminDetailsContext.Provider>
  )
}

// Custom hook to use the context
const useAdminDetails = (): AdminDetails => {
  const context = useContext(AdminDetailsContext)
  if (context === undefined) {
    throw new Error(
      "useAdminDetails must be used within an AdminDetailsProvider"
    )
  }
  return context
}

export { AdminDetailsProvider, useAdminDetails }
