import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    // Always show first and last page
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Start with first page
      pages.push(1)

      // Handle middle pages
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      if (startPage > 2) pages.push(-1) // Ellipsis

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) pages.push(-1) // Ellipsis

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => onPageChange(currentPage - 1)}
            />
          ) : (
            <span className="px-2 text-gray-500 cursor-pointer">Previous</span>
          )}
        </PaginationItem>

        {generatePageNumbers().map((page, index) =>
          page > 0 ? (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <span className="px-2 text-gray-500">...</span>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext
              className="cursor-pointer"
              onClick={() => onPageChange(currentPage + 1)}
            />
          ) : (
            <span className="px-2 text-gray-500 cursor-pointer">Next</span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
