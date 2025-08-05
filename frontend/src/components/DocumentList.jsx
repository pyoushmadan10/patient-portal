import axios from "axios"
import toast from "react-hot-toast"
import { Download, Trash2, FileText, Calendar, Scale } from "lucide-react"

const DocumentList = ({ documents, loading, onDeleteSuccess, apiUrl }) => {
  const handleDownload = (id, filename) => {
    axios({
      url: `${apiUrl}/${id}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        toast.success(`Downloading ${filename}`)
      })
      .catch((error) => {
        toast.error("Download failed.")
        console.error("Download error:", error)
      })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const toastId = toast.loading("Deleting document...")
      try {
        await axios.delete(`${apiUrl}/${id}`)
        toast.success("Document deleted successfully!", { id: toastId })
        onDeleteSuccess()
      } catch (error) {
        toast.error("Failed to delete document.", { id: toastId })
        console.error("Delete error:", error)
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
        <p className="text-gray-500">Upload your first document to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Document
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Size
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Upload Date
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-red-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.filename}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatFileSize(doc.filesize)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      onClick={() => handleDownload(doc.id, doc.filename)}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{doc.filename}</h3>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatFileSize(doc.filesize)}</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-all duration-200"
                onClick={() => handleDownload(doc.id, doc.filename)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-all duration-200"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocumentList
