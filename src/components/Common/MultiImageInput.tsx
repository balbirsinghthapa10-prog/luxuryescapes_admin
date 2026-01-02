// import React from "react"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"

// const MAX_IMAGES = 3

// interface MultiImageInputProps {
//   images: (string | File)[]
//   setImages: React.Dispatch<React.SetStateAction<(string | File)[]>>
//   previews: string[]
//   setPreviews: React.Dispatch<React.SetStateAction<string[]>>
//   // error: string
//   imageError: string
//   setImageError: React.Dispatch<React.SetStateAction<string>>
//   setImageToDelete?: React.Dispatch<React.SetStateAction<string[]>>
// }

// const MultiImageInput: React.FC<MultiImageInputProps> = ({
//   images,
//   setImages,
//   previews,
//   setPreviews,
//   // error,
//   imageError,
//   setImageError,
//   setImageToDelete,
// }) => {
//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files
//     if (!files) return

//     if (images.length + files.length > MAX_IMAGES) {
//       setImageError(`You can only upload up to ${MAX_IMAGES} images.`)
//       return
//     }

//     const newImages = Array.from(files)
//     const newPreviews = newImages.map((file) => URL.createObjectURL(file))

//     setImages((prev) => [...prev, ...newImages])
//     setPreviews((prev) => [...prev, ...newPreviews])
//     setImageError("")
//   }

//   const removeImage = (index: number) => {
//     const updatedImages = [...images]
//     const updatedPreviews = [...previews]

//     updatedImages.splice(index, 1)
//     updatedPreviews.splice(index, 1)

//     setImages(updatedImages)
//     setPreviews(updatedPreviews)
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold text-primary mb-4">
//         Upload Images
//       </h2>
//       <p className="text-gray-500 mb-2">
//         You can upload up to <span className="font-semibold">{MAX_IMAGES}</span>{" "}
//         images.
//       </p>
//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleImageChange}
//         disabled={images.length >= MAX_IMAGES}
//         className="block w-full mb-4 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//       />
//       {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
//       {imageError && <p className="text-red-500 mb-4">{imageError}</p>}

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//         {previews.map((preview, index) => (
//           <div
//             key={preview}
//             className="relative w-full aspect-square rounded-md shadow-md"
//           >
//             <Image
//               src={preview}
//               alt={`Preview ${index + 1}`}
//               layout="fill"
//               objectFit="cover"
//               className="rounded-md"
//             />
//             <button
//               type="button"
//               onClick={() => removeImage(index)}
//               className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>

//       {images.length >= MAX_IMAGES && (
//         <p className="text-red-500 mt-2 text-sm">
//           You have reached the upload limit of {MAX_IMAGES} images.
//         </p>
//       )}
//     </div>
//   )
// }

// export default MultiImageInput

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const MAX_IMAGES = 3

interface MultiImageInputProps {
  images: (string | File)[]
  setImages: React.Dispatch<React.SetStateAction<(string | File)[]>>
  previews: string[]
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  // error: string
  imageError: string
  setImageError: React.Dispatch<React.SetStateAction<string>>
  setImageToDelete?: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiImageInput: React.FC<MultiImageInputProps> = ({
  images,
  setImages,
  previews,
  setPreviews,
  // error,
  imageError,
  setImageError,
  setImageToDelete,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    if (images.length + files.length > MAX_IMAGES) {
      setImageError(`You can only upload up to ${MAX_IMAGES} images.`)
      return
    }

    const newImages = Array.from(files)
    const newPreviews = newImages.map((file) => URL.createObjectURL(file))

    setImages((prev) => [...prev, ...newImages])
    setPreviews((prev) => [...prev, ...newPreviews])
    setImageError("")
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    const updatedPreviews = [...previews]

    if (typeof updatedPreviews[index] === "string" && setImageToDelete) {
      const imageUrl = updatedPreviews[index] as string
      setImageToDelete((prev) => [...prev, imageUrl])
    }

    updatedImages.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setImages(updatedImages)
    setPreviews(updatedPreviews)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-4">
        Upload Images
      </h2>
      <p className="text-gray-500 mb-2">
        You can upload up to <span className="font-semibold">{MAX_IMAGES}</span>{" "}
        images.
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        disabled={images.length >= MAX_IMAGES}
        className="block w-full mb-4 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
      {imageError && <p className="text-red-500 mb-4">{imageError}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {previews.map((preview, index) => (
          <div
            key={preview}
            className="relative w-full aspect-square rounded-md shadow-md"
          >
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {images.length >= MAX_IMAGES && (
        <p className="text-red-500 mt-2 text-sm">
          You have reached the upload limit of {MAX_IMAGES} images.
        </p>
      )}
    </div>
  )
}

export default MultiImageInput
