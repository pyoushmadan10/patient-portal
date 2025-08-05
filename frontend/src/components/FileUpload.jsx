import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { UploadCloud, FileIcon, X } from "lucide-react"

const API_URL = "http://localhost:3000/api/documents/upload"

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.")
      setSelectedFile(null)
      event.target.value = null
      return
    }
    setSelectedFile(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.")
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    setUploading(true)
    const toastId = toast.loading("Uploading file...")

    try {
      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("File uploaded successfully!", { id: toastId })
      onUploadSuccess()
      setSelectedFile(null)
      document.getElementById("file-input").value = null
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Upload failed. Please try again."
      toast.error(errorMessage, { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    document.getElementById("file-input").value = null
  }

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-200 ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : selectedFile
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <UploadCloud className={`mx-auto h-12 w-12 mb-4 ${selectedFile ? "text-green-500" : "text-gray-400"}`} />
          <div className="text-sm sm:text-base">
            {selectedFile ? (
              <div className="space-y-2">
                <p className="font-medium text-green-700">File selected successfully!</p>
                <p className="text-gray-600">Click upload to continue</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-gray-700">
                  <span className="text-blue-600 hover:text-blue-500 cursor-pointer">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-gray-500">PDF files only (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected File Display */}
      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <FileIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="ml-3 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 mr-2" />
              Upload Document
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default FileUpload
