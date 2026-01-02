import React from "react"
import Image from "next/image"

const MainSpinner = () => {
  return (
    <div className="flex items-center justify-center mt-20 w-full relative bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Spinner Container */}
      <div className="absolute w-20 h-20 border-4 border-gray-300 border-t-blue-500 border-opacity-100 rounded-full animate-spin"></div>

      {/* Logo */}
      <div className="z-10 flex items-center justify-center">
        <Image
          src="/going.png"
          alt="Logo"
          width={100}
          height={100}
          className=" object-contain animate-pulse"
        />
      </div>
    </div>
  )
}

export default MainSpinner
