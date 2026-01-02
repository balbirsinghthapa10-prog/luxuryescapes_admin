"use client"
import React, {
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
  useEffect,
} from "react"
import { File, X, Paperclip, Loader2Icon } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface MailSendFormProps {
  email: string
  name: string
  onChange: (value: number) => void
  id: string
}

const MailSendForm: React.FC<MailSendFormProps> = ({
  email,
  name,
  onChange,
  id,
}) => {
  const [recipient, setRecipient] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [files, setFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024 // 25MB
  const MAX_FILES = 5

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : []
    setUploadError("")

    if (files.length + selectedFiles.length > MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed`)
      return
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File ${file.name} exceeds 10MB limit`)
        return false
      }
      return true
    })

    const totalSize = [...files, ...validFiles].reduce(
      (acc, file) => acc + file.size,
      0
    )
    if (totalSize > MAX_TOTAL_SIZE) {
      setUploadError("Total file size cannot exceed 25MB")
      return
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove))
  }

  const handleSendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!recipient || !subject || !message) {
      alert("Please fill in all required fields")
      return
    }

    const formData = new FormData()
    formData.append("email", recipient)
    formData.append("name", name)
    formData.append("subject", subject)
    formData.append("message", message)

    // Improved file attachment logic
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file, file.name)
      })
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_PROD}/quote/reply-to-client/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      if (response.data.success) {
        onChange(1)
        setLoading(false)
        toast.success("Email sent successfully to " + name ? name : recipient)
        // Reset form
        setRecipient("")
        setSubject("")
        setMessage("")
        setFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    } catch (error) {
      setLoading(false)
      console.error("Error sending email:", error)
      toast.error("Failed to send email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  useEffect(() => {
    setRecipient(email)
  }, [email])

  return (
    <div className="w-[400px] mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSendEmail}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">To:</label>
          <p className="text-primary font-semibold">{email || "Loading..."}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Email subject"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Your message"
            required
          />
        </div>
        <div className="mb-2">
          <p className="text-gray-600 italic">
            Note: PDFs only, Max total size 10 MB, Max files {MAX_FILES}
          </p>
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Paperclip className="mr-2" /> Attach Files
          </button>
          {uploadError && (
            <div className="text-red-500 mt-2">{uploadError}</div>
          )}
          {files.length > 0 && (
            <div className="mt-2 border-t pt-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded mb-1"
                >
                  <div className="flex items-center">
                    <File className="mr-2 text-blue-500" size={20} />
                    <span>{file.name}</span>
                    <span className="ml-2 text-gray-500 text-sm">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? (
            <div className="flex gap-2">
              Sending Email...
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            "Send Email"
          )}
        </button>
      </form>
    </div>
  )
}

export default MailSendForm
