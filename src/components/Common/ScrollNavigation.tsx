// ScrollNavigation.tsx
"use client"

import React, { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

const ScrollNavigation = () => {
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  // Show buttons only when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const pageHeight = document.body.scrollHeight
      const windowHeight = window.innerHeight

      // Only show when there's enough content to scroll
      setShowScrollButtons(pageHeight > windowHeight * 1.5)
    }

    // Check initially
    handleScroll()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }

  if (!showScrollButtons) return null

  return (
    <div className="fixed right-20 bottom-28 flex flex-col gap-3 z-50">
      <button
        onClick={scrollToTop}
        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
      <button
        onClick={scrollToBottom}
        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll to bottom"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  )
}

export default ScrollNavigation
