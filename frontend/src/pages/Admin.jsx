import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  DocumentTextIcon, 
  FolderIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon 
} from "@heroicons/react/24/outline"
import api from "../hooks/axios"

export default function Admin() {
  const [activeTab, setActiveTab] = useState('conversations')
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversationContent, setConversationContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Check authentication
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    const user = localStorage.getItem("user") || sessionStorage.getItem("user")
    
    if (!accessToken || !user) {
      navigate("/login")
    }
  }, [navigate])

  useEffect(() => {
    if (activeTab === 'conversations') {
      fetchConversations()
    }
  }, [activeTab])

  const fetchConversations = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await api.get('/api/conversations')
      
      if (Array.isArray(response.data)) {
        setConversations(response.data)
      } else if (response.data && typeof response.data === 'object') {
        const arr = Object.values(response.data)
        setConversations(Array.isArray(arr) ? arr : [])
      } else {
        setConversations([])
      }
    } catch (err) {
      setError('Failed to load conversations')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConversationContent = async (filename) => {
    setIsLoadingContent(true)
    setError('')
    try {
      const response = await api.get(`/api/conversations/${filename}`)
      setConversationContent(response.data.content)
      setSelectedConversation(response.data)
    } catch (err) {
      setError('Failed to load conversation content')
      console.error(err)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
    sessionStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-barn">
      {/* Header */}
      <div className="bg-charcoal border-b border-rust/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-display text-2xl text-nav-text">
              Admin <span className="text-rust">Dashboard</span>
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust-dark transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-rust/20 bg-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('conversations')
                setSelectedConversation(null)
                setConversationContent('')
              }}
              className={`py-4 px-1 border-b-2 font-label text-sm font-medium transition-colors ${
                activeTab === 'conversations'
                  ? 'border-rust text-rust'
                  : 'border-transparent text-muted hover:text-nav-text hover:border-rust/30'
              }`}
            >
              Conversations
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 bg-charcoal/30 rounded-lg border border-rust/20 p-4">
              <h2 className="font-label text-lg text-nav-text mb-4 flex items-center">
                <FolderIcon className="h-5 w-5 mr-2 text-rust" />
                Conversation Files
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rust"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {Array.isArray(conversations) && conversations.map((conv) => (
                    <button
                      key={conv.name}
                      onClick={() => fetchConversationContent(conv.name)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedConversation?.filename === conv.name
                          ? 'bg-rust/20 border border-rust'
                          : 'bg-charcoal hover:bg-charcoal/80 border border-rust/10 hover:border-rust/30'
                      }`}
                    >
                      <div className="flex items-start">
                        <DocumentTextIcon className="h-5 w-5 text-rust mt-0.5 mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-nav-text truncate">
                            {conv.name}
                          </p>
                          <div className="flex items-center text-xs text-muted mt-1 space-x-2">
                            <span className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(conv.modified).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {formatFileSize(conv.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {(!conversations || conversations.length === 0) && !isLoading && (
                    <p className="text-muted text-sm text-center py-8">
                      No conversation files found
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Conversation Content */}
            <div className="lg:col-span-2 bg-charcoal/30 rounded-lg border border-rust/20 p-6">
              {selectedConversation ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-label text-lg text-nav-text flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-rust" />
                      {selectedConversation.filename}
                    </h3>
                    <button
                      onClick={() => fetchConversationContent(selectedConversation.filename)}
                      className="text-xs text-rust hover:text-rust-light"
                    >
                      Refresh
                    </button>
                  </div>
                  
                  {isLoadingContent ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rust"></div>
                    </div>
                  ) : (
                    <div className="bg-barn rounded-lg p-4 border border-rust/10 overflow-auto max-h-[600px]">
                      <pre className="text-sm text-muted whitespace-pre-wrap font-mono">
                        {conversationContent}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <DocumentTextIcon className="h-16 w-16 text-rust/30 mb-4" />
                  <p className="text-muted text-sm">
                    Select a conversation file to view its content
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}