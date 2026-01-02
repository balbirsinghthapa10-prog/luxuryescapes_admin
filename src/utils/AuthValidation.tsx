"use client"
import axios from "axios"
import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react"

// Define the interface for authentication state
interface AuthState {
  isLoggedIn: boolean
  loading: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

// Create the context with a default value
const AuthContext = createContext<AuthState | undefined>(undefined)

// Provider component
interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Check for authentication status on initial load
  const checkAuthStatus = async () => {
    // Check if user is logged in by looking for token in localStorage
    try {
      const token = localStorage.getItem("luxtoken")

      if (!token) {
        setIsLoggedIn(false)
        setLoading(false)
      }

      // const response = await axios.get(
      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/validat`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // )

      // const data = response.data
      // setIsLoggedIn(data.success === true)
      setIsLoggedIn(true)
    } catch (error) {
      console.error("Auth validation error:", error)
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // We need to check auth status regardless of isLoggedIn value
    // When the component mounts
    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
const useAuth = (): AuthState => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }
