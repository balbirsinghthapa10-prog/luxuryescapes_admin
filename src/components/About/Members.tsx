"use client"
import React, { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, User } from "lucide-react"

interface Member {
  _id?: string
  id?: string
  memberName: string
  memberDesignation: string
  memberImage: string
}

interface MemberFormData {
  memberName: string
  memberDesignation: string
  memberImage: string
}

interface ApiResponse {
  _id?: string
  id?: string
  message?: string
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [formData, setFormData] = useState<MemberFormData>({
    memberName: "",
    memberDesignation: "",
    memberImage: "",
  })
  const [memberImageFile, setMemberImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/member`
      )
      const data = await response.json()
      if (response.ok) {
        setMembers(data.data || [])
      } else {
        setError("Failed to fetch members")
      }
    } catch (err) {
      setError("An error occurred while fetching members")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    field: keyof MemberFormData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (file: File | null): void => {
    if (file) {
      setMemberImageFile(file)

      // Create preview URL for display
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          handleInputChange("memberImage", e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = (): void => {
    setFormData({
      memberName: "",
      memberDesignation: "",
      memberImage: "",
    })
    setMemberImageFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!formData.memberName.trim() || !formData.memberDesignation.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("memberName", formData.memberName)
      formDataToSend.append("memberDesignation", formData.memberDesignation)

      // Add image file if selected
      if (memberImageFile) {
        formDataToSend.append("memberImage", memberImageFile)
      }

      let response: Response
      if (editingId) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/member/edit/${editingId}`,
          {
            method: "PUT",
            body: formDataToSend,
          }
        )
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PROD}/add/member`,
          {
            method: "POST",
            body: formDataToSend,
          }
        )
      }

      if (response.ok) {
        const result: ApiResponse = await response.json()
        setSuccess(
          editingId
            ? "Member updated successfully!"
            : "Member added successfully!"
        )
        resetForm()
        fetchMembers() // Refresh the list
      } else {
        setError("Failed to save member")
      }
    } catch (err) {
      setError("An error occurred while saving")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: Member): void => {
    setFormData({
      memberName: member.memberName,
      memberDesignation: member.memberDesignation,
      memberImage: member.memberImage,
    })
    setEditingId(member._id || member.id || null)
    setShowForm(true)
    setMemberImageFile(null) // Clear file since we're editing existing
  }

  const handleDelete = async (id: string): Promise<void> => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/member/delete/${id}`,
        {
          method: "DELETE",
        }
      )

      if (response.ok) {
        setSuccess("Member deleted successfully!")
        fetchMembers() // Refresh the list
      } else {
        setError("Failed to delete member")
      }
    } catch (err) {
      setError("An error occurred while deleting")
    } finally {
      setLoading(false)
      setDeleteConfirm(null)
    }
  }

  const clearMessages = (): void => {
    setError("")
    setSuccess("")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Members Management
            </h1>
            <p className="text-gray-600">
              Manage team members and their information
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add New Member
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-700">{error}</span>
          <button
            onClick={clearMessages}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-700">{success}</span>
          <button
            onClick={clearMessages}
            className="text-green-500 hover:text-green-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Member" : "Add New Member"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Member Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Name *
                </label>
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) =>
                    handleInputChange("memberName", e.target.value)
                  }
                  placeholder="Enter member name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Member Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Designation *
                </label>
                <input
                  type="text"
                  value={formData.memberDesignation}
                  onChange={(e) =>
                    handleInputChange("memberDesignation", e.target.value)
                  }
                  placeholder="Enter member designation..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Member Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e.target.files?.[0] || null)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {memberImageFile && (
                    <div className="text-sm text-gray-600">
                      Selected file: {memberImageFile.name} (
                      {Math.round(memberImageFile.size / 1024)}KB)
                    </div>
                  )}
                  {formData.memberImage && (
                    <div className="relative inline-block">
                      <img
                        src={formData.memberImage}
                        alt="Member preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleInputChange("memberImage", "")
                          setMemberImageFile(null)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Member"
                    : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Members ({members.length})
          </h2>
        </div>

        {loading && members.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">No members found</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {members.map((member) => (
              <div
                key={member._id || member.id}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {member.memberImage ? (
                      <img
                        src={member.memberImage}
                        alt={member.memberName}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <User size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {member.memberName}
                      </h3>
                      <p className="text-gray-600">
                        {member.memberDesignation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm(member._id || member.id || "")
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this member? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
