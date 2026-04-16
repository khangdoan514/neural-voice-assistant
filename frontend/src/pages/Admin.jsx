import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAdminProfile } from "../hooks/useAdminProfile"
import { fetchConversationsListApi, fetchConversationContentApi } from "../api/adminAPI"
import Sidebar from "../components/Sidebar"
import { fadeInUp } from "./admin/variants"
import { tabMeta } from "./admin/tabMeta"
import { activeTabForPathname } from "../routing/adminRouting"
import {
  cloneDefaultContactPeople,
  cloneDefaultHomeHeroCards,
  defaultAboutStoryImage,
  defaultContactBusinessHoursImage,
  newContactPersonTemplate,
} from "./admin/contentDefaults"
import AdminWelcome from "./admin/AdminWelcome"
import AdminConversations from "./admin/AdminConversations"
import AdminHomeEditor from "./admin/AdminHomeEditor"
import AdminAboutEditor from "./admin/AdminAboutEditor"
import AdminContactEditor from "./admin/AdminContactEditor"
import AdminSettings from "./admin/AdminSettings"
import AdminComingSoon from "./admin/AdminComingSoon"

export default function Admin() {
  const [activeTab, setActiveTab] = useState("welcome")
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversationContent, setConversationContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [error, setError] = useState("")
  const { adminProfile, fetchAdminProfile, updateAdminProfile, isLoading: isLoadingProfile } = useAdminProfile()
  const [isSavingHome, setIsSavingHome] = useState(false)
  const [isSavingAbout, setIsSavingAbout] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState("")
  const [homeHeroCards, setHomeHeroCards] = useState(() => cloneDefaultHomeHeroCards())
  const [aboutStoryImage, setAboutStoryImage] = useState(defaultAboutStoryImage)
  const [contactBusinessHoursImage, setContactBusinessHoursImage] = useState(defaultContactBusinessHoursImage)
  const [contactPeople, setContactPeople] = useState(() => cloneDefaultContactPeople())
  const navigate = useNavigate()
  const location = useLocation()
  const [settingsFirstName, setSettingsFirstName] = useState("")
  const [settingsLastName, setSettingsLastName] = useState("")
  const [settingsEmail, setSettingsEmail] = useState("")
  const [settingsProfilePicture, setSettingsProfilePicture] = useState("")

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    const user = localStorage.getItem("user") || sessionStorage.getItem("user")

    if (!accessToken || !user) {
      navigate("/login")
    }
  }, [navigate])

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    if (!accessToken) return
    fetchAdminProfile(accessToken)
  }, [fetchAdminProfile])

  useEffect(() => {
    if (!adminProfile) return
    setSettingsFirstName(adminProfile.first_name || "")
    setSettingsLastName(adminProfile.last_name || "")
    setSettingsEmail(adminProfile.email || "")
    setSettingsProfilePicture(adminProfile.profile_picture || adminProfile.avatar || "")
  }, [adminProfile])

  useEffect(() => {
    if (activeTab === "conversations") {
      fetchConversations()
    }
  }, [activeTab])

  useEffect(() => {
    setActiveTab(activeTabForPathname(location.pathname))
  }, [location.pathname])

  const fetchConversations = async () => {
    setIsLoading(true)
    setError("")
    try {
      const list = await fetchConversationsListApi()
      setConversations(list)
    } catch (err) {
      setError("Failed to load conversations")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConversationContent = async (filename) => {
    setIsLoadingContent(true)
    setError("")
    try {
      const data = await fetchConversationContentApi(filename)
      setConversationContent(data.content)
      setSelectedConversation(data)
    } catch (err) {
      setError("Failed to load conversation content")
      console.error(err)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
    sessionStorage.removeItem("user")
    navigate("/login")
  }

  const handleSettingsImageUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSettingsProfilePicture(String(reader.result || ""))
    reader.readAsDataURL(file)
  }

  const saveSettings = async () => {
    setIsSavingSettings(true)
    setSaveSuccess("")
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
      if (!accessToken) {
        navigate("/login")
        return
      }

      const updated = await updateAdminProfile(accessToken, {
        first_name: settingsFirstName,
        last_name: settingsLastName,
        email: settingsEmail,
        profile_picture: settingsProfilePicture || null,
      })

      if (!updated) {
        setError("Failed to save settings")
        return
      }

      setSaveSuccess("Settings saved successfully.")
      setTimeout(() => setSaveSuccess(""), 2000)
    } catch (err) {
      setError("Failed to save settings")
      console.error(err)
    } finally {
      setIsSavingSettings(false)
    }
  }

  const updateHomeCard = (index, field, value) => {
    setHomeHeroCards((prev) => prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)))
  }

  const handleImageUpload = (index, file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      updateHomeCard(index, "image", String(reader.result || ""))
    }

    reader.readAsDataURL(file)
  }

  const handleAboutImageUpload = (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setAboutStoryImage(String(reader.result || ""))
    }

    reader.readAsDataURL(file)
  }

  const handleContactBusinessImageUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setContactBusinessHoursImage(String(reader.result || ""))
    }
    reader.readAsDataURL(file)
  }

  const updateContactPerson = (index, field, value) => {
    setContactPeople((prev) => prev.map((person, i) => (i === index ? { ...person, [field]: value } : person)))
  }

  const addContactPerson = () => {
    setContactPeople((prev) => [...prev, { ...newContactPersonTemplate }])
  }

  const removeContactPerson = (index) => {
    setContactPeople((prev) => {
      if (prev.length <= 2) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleContactPersonImageUpload = (index, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateContactPerson(index, "image", String(reader.result || ""))
    }
    reader.readAsDataURL(file)
  }

  const saveHomeContent = () => {
    setIsSavingHome(true)
    setSaveSuccess("")
    setSaveSuccess("Home hero cards updated (not persisted yet).")
    setTimeout(() => setSaveSuccess(""), 2000)
    setIsSavingHome(false)
  }

  const resetHomeContent = () => {
    setHomeHeroCards(cloneDefaultHomeHeroCards())
    setSaveSuccess("Home hero cards reset to defaults.")
    setTimeout(() => setSaveSuccess(""), 2000)
  }

  const saveAboutContent = () => {
    setIsSavingAbout(true)
    setSaveSuccess("")
    setSaveSuccess("About image updated (not persisted yet).")
    setTimeout(() => setSaveSuccess(""), 2000)
    setIsSavingAbout(false)
  }

  const resetAboutContent = () => {
    setAboutStoryImage(defaultAboutStoryImage)
    setSaveSuccess("About image reset to default.")
    setTimeout(() => setSaveSuccess(""), 2000)
  }

  const saveContactContent = () => {
    setIsSavingContact(true)
    setSaveSuccess("")
    setSaveSuccess("Contact section updated (not persisted yet).")
    setTimeout(() => setSaveSuccess(""), 2000)
    setIsSavingContact(false)
  }

  const resetContactContent = () => {
    setContactBusinessHoursImage(defaultContactBusinessHoursImage)
    setContactPeople(cloneDefaultContactPeople())
    setSaveSuccess("Contact images reset to defaults.")
    setTimeout(() => setSaveSuccess(""), 2000)
  }

  return (
    <div className="h-screen bg-barn flex overflow-hidden">
      <Sidebar onLogout={handleLogout} userProfile={adminProfile} />

      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-6 xl:p-8">
          {activeTab !== "welcome" && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6 sm:mb-8 border-b border-rust/20 pb-4"
            >
              <h1 className="font-display text-2xl sm:text-3xl text-nav-text">
                {tabMeta[activeTab]?.title || "Admin"}
              </h1>
              <p className="text-sm sm:text-base text-muted mt-1">
                {tabMeta[activeTab]?.subtitle || "Manage content and settings."}
              </p>
            </motion.div>
          )}

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {activeTab === "welcome" && <AdminWelcome adminProfile={adminProfile} />}

          {activeTab === "conversations" && (
            <AdminConversations
              conversations={conversations}
              isLoading={isLoading}
              selectedConversation={selectedConversation}
              conversationContent={conversationContent}
              isLoadingContent={isLoadingContent}
              fetchConversationContent={fetchConversationContent}
              formatFileSize={formatFileSize}
            />
          )}

          {activeTab === "settings" && (
            <AdminSettings
              settingsFirstName={settingsFirstName}
              setSettingsFirstName={setSettingsFirstName}
              settingsLastName={settingsLastName}
              setSettingsLastName={setSettingsLastName}
              settingsEmail={settingsEmail}
              setSettingsEmail={setSettingsEmail}
              settingsProfilePicture={settingsProfilePicture}
              setSettingsProfilePicture={setSettingsProfilePicture}
              handleSettingsImageUpload={handleSettingsImageUpload}
              saveSettings={saveSettings}
              isSavingSettings={isSavingSettings}
              isLoadingProfile={isLoadingProfile}
              saveSuccess={saveSuccess}
            />
          )}

          {activeTab === "home" && (
            <AdminHomeEditor
              homeHeroCards={homeHeroCards}
              updateHomeCard={updateHomeCard}
              handleImageUpload={handleImageUpload}
              saveHomeContent={saveHomeContent}
              resetHomeContent={resetHomeContent}
              isSavingHome={isSavingHome}
              saveSuccess={saveSuccess}
            />
          )}

          {activeTab === "about" && (
            <AdminAboutEditor
              aboutStoryImage={aboutStoryImage}
              setAboutStoryImage={setAboutStoryImage}
              handleAboutImageUpload={handleAboutImageUpload}
              saveAboutContent={saveAboutContent}
              resetAboutContent={resetAboutContent}
              isSavingAbout={isSavingAbout}
              saveSuccess={saveSuccess}
            />
          )}

          {activeTab === "contact" && (
            <AdminContactEditor
              contactBusinessHoursImage={contactBusinessHoursImage}
              setContactBusinessHoursImage={setContactBusinessHoursImage}
              handleContactBusinessImageUpload={handleContactBusinessImageUpload}
              contactPeople={contactPeople}
              updateContactPerson={updateContactPerson}
              addContactPerson={addContactPerson}
              removeContactPerson={removeContactPerson}
              handleContactPersonImageUpload={handleContactPersonImageUpload}
              saveContactContent={saveContactContent}
              resetContactContent={resetContactContent}
              isSavingContact={isSavingContact}
              saveSuccess={saveSuccess}
            />
          )}

          {activeTab === "comingSoon" && <AdminComingSoon />}
        </div>
      </div>
    </div>
  )
}
