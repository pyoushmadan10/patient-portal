import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./components/Header"
import FileUpload from "./components/FileUpload"
import DocumentList from "./components/DocumentList"

const API_URL = "https://patient-portal-4g7m.onrender.com/api/documents"

function App() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  // Function to fetch all documents
  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setDocuments(response.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch documents on initial component mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Upload New Document</h2>
              </div>
              <FileUpload onUploadSuccess={fetchDocuments} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-green-600 rounded-full mr-4"></div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Documents</h2>
              </div>
              <DocumentList documents={documents} loading={loading} onDeleteSuccess={fetchDocuments} apiUrl={API_URL} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
