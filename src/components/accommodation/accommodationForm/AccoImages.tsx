// // import Image from "next/image"
// // import React, { useState, useEffect } from "react"

// // interface AccoImagesProps {
// //   images: File[]
// //   setImages: React.Dispatch<React.SetStateAction<File[]>>
// //   error?: string
// //   maxImages?: number
// //   maxFileSize?: number
// //   previews?: string[]
// //   oldImagesPreviews?: string[]
// //   imageToDelete?: React.Dispatch<React.SetStateAction<string[]>>
// //   setPreviews?: React.Dispatch<React.SetStateAction<string[]>>
// // }

// // const AccoImages: React.FC<AccoImagesProps> = ({
// //   images,
// //   setImages,
// //   previews,
// //   setPreviews,
// //   oldImagesPreviews,
// //   imageToDelete,
// //   error,
// //   maxImages = 5,
// //   maxFileSize = 1 * 1024 * 1024, // 1MB default
// // }) => {
// //   // Handle creating and cleaning up image previews
// //   useEffect(() => {

// //     const objectUrls = images.map((image) => URL.createObjectURL(image))
// //     setPreviews && setPreviews(objectUrls)

// //     return () => {
// //       objectUrls.forEach((url) => URL.revokeObjectURL(url))
// //     }
// //   }, [images])

// //   // Handle adding new images
// //   const handleAccommodationImages = (
// //     e: React.ChangeEvent<HTMLInputElement>
// //   ) => {
// //     const files = e.target.files
// //     if (files) {
// //       // Convert FileList to Array and apply validations
// //       const newImages = Array.from(files).filter(
// //         (file) => file.type.startsWith("image/") && file.size <= maxFileSize
// //       )

// //       setImages((prev) => {
// //         // Combine and slice to max images
// //         const combinedImages = [...prev, ...newImages]
// //         return combinedImages.slice(0, maxImages)
// //       })
// //     }
// //   }

// //   // Handle removing an image
// //   const removeImage = (index: number) => {
// //     setImages((prev) => prev.filter((_, i) => i !== index))
// //   }

// //   return (
// //     <div className="mb-4">
// //       <label className="block text-lg font-medium text-gray-700">
// //         Accommodation Images <span className="text-red-700">*</span>
// //       </label>
// //       {error && <p className="text-red-500 text-sm">{error}</p>}

// //       <div className="mt-2">
// //         <input
// //           type="file"
// //           onChange={handleAccommodationImages}
// //           accept="image/*"
// //           multiple
// //           className="mb-2"
// //         />
// //         <p className="text-sm text-gray-600 mb-2">
// //           Max {maxImages} images, each up to {maxFileSize / 1024 / 1024}MB
// //         </p>

// //         {images.length > 0 && (
// //           <div className="grid grid-cols-3 gap-4 mt-4">
// //             {previews?.map((preview, index) => (
// //               <div key={index} className="relative">
// //                 <img
// //                   src={preview}
// //                   alt={`Accommodation ${index + 1}`}
// //                   className="w-full h-32 object-cover rounded-lg"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => removeImage(index)}
// //                   aria-label={`Remove image ${index + 1}`}
// //                   className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
// //                 >
// //                   Remove
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         <p className="text-sm text-gray-600 mt-4">Currect Image:</p>
// //         {oldImagesPreviews && oldImagesPreviews.length > 0 && (
// //           <div className="grid grid-cols-3 gap-4 mt-4">
// //             {oldImagesPreviews.map((preview, index) => (
// //               <div key={index} className="relative">
// //                 <Image
// //                   src={preview}
// //                   alt={`Accommodation ${index + 1}`}
// //                   className="object-cover rounded-lg"
// //                   width={200}
// //                   height={200}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => removeImage(index)}
// //                   aria-label={`Remove image ${index + 1}`}
// //                   className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
// //                 >
// //                   Remove
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default AccoImages

// import Image from "next/image"
// import React, { useState, useEffect } from "react"
// import { set } from "zod"

// interface AccoImagesProps {
//   images: File[]
//   setImages: React.Dispatch<React.SetStateAction<File[]>>
//   error?: string
//   maxImages?: number
//   maxFileSize?: number
//   previews?: string[]
//   oldImagesPreviews?: string[]
//   setOldImagesPreviews?: React.Dispatch<React.SetStateAction<string[]>>
//   imageToDelete?: React.Dispatch<React.SetStateAction<string[]>>
//   setPreviews?: React.Dispatch<React.SetStateAction<string[]>>
// }

// const AccoImages: React.FC<AccoImagesProps> = ({
//   images,
//   setImages,
//   previews,
//   setPreviews,
//   oldImagesPreviews,
//   setOldImagesPreviews,
//   imageToDelete,
//   error,
//   maxImages = 5,
//   maxFileSize = 2 * 1024 * 1024, // 2MB default
// }) => {
//   // Handle creating and cleaning up image previews
//   useEffect(() => {
//     const objectUrls = images.map((image) => URL.createObjectURL(image))
//     setPreviews && setPreviews(objectUrls)

//     return () => {
//       objectUrls.forEach((url) => URL.revokeObjectURL(url))
//     }
//   }, [images])

//   // Handle adding new images
//   const handleAccommodationImages = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = e.target.files
//     if (files) {
//       // Convert FileList to Array and apply validations
//       const newImages = Array.from(files).filter(
//         (file) => file.type.startsWith("image/") && file.size <= maxFileSize
//       )

//       setImages((prev) => {
//         // Combine and slice to max images
//         const combinedImages = [...prev, ...newImages]
//         return combinedImages.slice(0, maxImages)
//       })
//     }
//   }

//   // Handle removing a new image
//   const removeImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index))
//   }

//   // Handle removing an existing image
//   const removeOldImage = (index: number, imagePath: string) => {
//     if (imageToDelete) {
//       // Add the image path to the imageToDelete state
//       imageToDelete((prev) => [...prev, imagePath])
//       setOldImagesPreviews &&
//         setOldImagesPreviews((prev) => prev.filter((_, i) => i !== index))

//       // Remove the image from oldImagesPreviews if needed
//       // This would typically be handled by the parent component
//       // based on the imageToDelete state
//     }
//   }

//   return (
//     <div className="mb-4">
//       <label className="block text-lg font-medium text-gray-700">
//         Accommodation Images <span className="text-red-700">*</span>
//       </label>
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <div className="mt-2">
//         <input
//           type="file"
//           onChange={handleAccommodationImages}
//           accept="image/*"
//           multiple
//           className="mb-2"
//         />
//         <p className="text-sm text-gray-600 mb-2">
//           Max {maxImages} images, each up to {maxFileSize / 1024 / 1024}MB
//         </p>

//         {images.length > 0 && (
//           <div className="grid grid-cols-3 gap-4 mt-4">
//             {previews?.map((preview, index) => (
//               <div key={index} className="relative">
//                 <img
//                   src={preview}
//                   alt={`Accommodation ${index + 1}`}
//                   className="w-full h-32 object-cover rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeImage(index)}
//                   aria-label={`Remove image ${index + 1}`}
//                   className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <p className="text-sm text-gray-600 mt-4">Current Images:</p>
//         {oldImagesPreviews && oldImagesPreviews.length > 0 && (
//           <div className="grid grid-cols-3 gap-4 mt-4">
//             {oldImagesPreviews.map((preview, index) => (
//               <div key={index} className="relative">
//                 <Image
//                   src={preview}
//                   alt={`Accommodation ${index + 1}`}
//                   className="object-cover rounded-lg"
//                   width={200}
//                   height={200}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeOldImage(index, preview)}
//                   aria-label={`Remove image ${index + 1}`}
//                   className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AccoImages

//updated

import Image from "next/image"
import React, { useState, useEffect } from "react"

interface AccoImagesProps {
  images: File[]
  setImages: React.Dispatch<React.SetStateAction<File[]>>
  error?: string
  maxImages?: number
  maxFileSize?: number
  previews?: string[]
  oldImagesPreviews?: string[]
  setOldImagesPreviews?: React.Dispatch<React.SetStateAction<string[]>>
  imageToDelete?: React.Dispatch<React.SetStateAction<string[]>>
  setPreviews?: React.Dispatch<React.SetStateAction<string[]>>
}

const AccoImages: React.FC<AccoImagesProps> = ({
  images,
  setImages,
  previews,
  setPreviews,
  oldImagesPreviews,
  setOldImagesPreviews,
  imageToDelete,
  error,
  maxImages = 5,
  maxFileSize = 2 * 1024 * 1024, // 2MB default
}) => {
  // Handle creating and cleaning up image previews
  useEffect(() => {
    const objectUrls = images.map((image) => URL.createObjectURL(image))
    setPreviews && setPreviews(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images, setPreviews])

  // Calculate remaining slots for new images
  const remainingSlots =
    maxImages - (oldImagesPreviews?.length || 0) - images.length

  // Handle adding new images
  const handleAccommodationImages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (files) {
      // Convert FileList to Array and apply validations
      const validImages = Array.from(files).filter(
        (file) => file.type.startsWith("image/") && file.size <= maxFileSize
      )

      // Calculate how many images we can actually add
      const currentTotal = (oldImagesPreviews?.length || 0) + images.length
      const canAdd = Math.max(0, maxImages - currentTotal)

      if (canAdd > 0) {
        const imagesToAdd = validImages.slice(0, canAdd)
        setImages((prev) => [...prev, ...imagesToAdd])
      }
    }

    // Clear the input so the same file can be selected again if needed
    e.target.value = ""
  }

  // Handle removing a new image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle removing an existing image
  const removeOldImage = (index: number, imagePath: string) => {
    if (imageToDelete && setOldImagesPreviews) {
      // Add the image path to the imageToDelete state
      imageToDelete((prev) => [...prev, imagePath])
      // Remove from preview
      setOldImagesPreviews((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const totalImages = (oldImagesPreviews?.length || 0) + images.length

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">
        Accommodation Images <span className="text-red-700">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="mt-2">
        <input
          type="file"
          onChange={handleAccommodationImages}
          accept="image/*"
          multiple
          className="mb-2"
          disabled={totalImages >= maxImages}
        />
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">
            Max {maxImages} images, each up to {maxFileSize / 1024 / 1024}MB
          </p>
          <p className="text-sm font-medium text-gray-700">
            {totalImages}/{maxImages} images selected
          </p>
        </div>

        {totalImages >= maxImages && (
          <p className="text-sm text-amber-600 mb-2">
            Maximum number of images reached. Remove an image to add new ones.
          </p>
        )}

        {/* Current/Existing Images */}
        {oldImagesPreviews && oldImagesPreviews.length > 0 && (
          <>
            <p className="text-sm text-gray-600 mt-4 mb-2">Current Images:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {oldImagesPreviews.map((preview, index) => (
                <div key={`old-${index}`} className="relative group">
                  <Image
                    src={preview}
                    alt={`Current accommodation ${index + 1}`}
                    className="object-cover rounded-lg border-2 border-gray-200"
                    width={200}
                    height={150}
                  />
                  <button
                    type="button"
                    onClick={() => removeOldImage(index, preview)}
                    aria-label={`Remove current image ${index + 1}`}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* New Images Preview */}
        {images.length > 0 && (
          <>
            <p className="text-sm text-gray-600 mt-4 mb-2">New Images:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews?.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt={`New accommodation ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove new image ${index + 1}`}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AccoImages
