import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAdminProfile } from "../hooks/useAdminProfile"
import {
  fetchConversationsListApi,
  fetchConversationContentApi,
  fetchHomeHeroCardsApi,
  saveHomeHeroCardsApi,
} from "../api/adminAPI"
import Sidebar from "../components/Sidebar"
import { fadeInUp } from "./admin/variants"
import { tabMeta } from "./admin/tabMeta"
import { activeTabForPathname } from "../routes/adminRouting"
import Welcome from "./admin/Welcome"
import Conversations from "./admin/Conversations"
import HomeEditor from "./admin/HomeEditor"
import AboutEditor from "./admin/AboutEditor"
import ContactEditor from "./admin/ContactEditor"
import Settings from "./admin/Settings"
import ComingSoon from "./admin/ComingSoon"

const DEFAULT_HOME_HERO_CARDS = [
  { label: "Farm Setup", image: "" },
  { label: "Poultry Farming", image: "" },
  { label: "Feeding Systems", image: "" },
  { label: "Equipment Service", image: "" },
]

const DEFAULT_ABOUT_STORY_IMAGE = "/images/about/story-photo.jpg"
const DEFAULT_CONTACT_BUSINESS_HOURS_IMAGE = "/images/support/business-hours.jpg"

const DEFAULT_CONTACT_PEOPLE = [
  {
    name: "Someone 1",
    role: "Service Coordinator",
    phone: "(000) 000-0000",
    email: "someone1@etpsupply.com",
    image: "/images/team/someone-1.jpg",
  },
  {
    name: "Someone 2",
    role: "Parts & Sales Support",
    phone: "(000) 000-0000",
    email: "someone2@etpsupply.com",
    image: "/images/team/someone-2.jpg",
  },
]

const NEW_CONTACT_PERSON_TEMPLATE = {
  name: "New Person",
  role: "Support Team",
  phone: "(000) 000-0000",
  email: "new.person@etpsupply.com",
  image: "",
}

function cloneDefaultHomeHeroCards() {
  return DEFAULT_HOME_HERO_CARDS.map((c) => ({ ...c }))
}

function cloneDefaultContactPeople() {
  return DEFAULT_CONTACT_PEOPLE.map((p) => ({ ...p }))
}

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
  const [aboutStoryImage, setAboutStoryImage] = useState(DEFAULT_ABOUT_STORY_IMAGE)
  const [contactBusinessHoursImage, setContactBusinessHoursImage] = useState(DEFAULT_CONTACT_BUSINESS_HOURS_IMAGE)
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
    if (activeTab !== "home") return
    let cancelled = false
    ;(async () => {
      try {
        const cards = await fetchHomeHeroCardsApi()
        if (cancelled || !cards || !Array.isArray(cards) || cards.length !== 4) return
        setHomeHeroCards(cards.map((c) => ({ label: c.label || "", image: typeof c.image === "string" ? c.image : "" })))
      } catch (err) {
        console.error("Failed to load home hero cards for admin", err)
      }
    })()

    return () => {
      cancelled = true
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
    setContactPeople((prev) => [...prev, { ...NEW_CONTACT_PERSON_TEMPLATE }])
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

  const saveHomeContent = async () => {
    setIsSavingHome(true)
    setSaveSuccess("")
    setError("")
    try {
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
      if (!accessToken) {
        navigate("/login")
        return
      }

      const saved = await saveHomeHeroCardsApi(accessToken, homeHeroCards)
      if (saved && Array.isArray(saved) && saved.length === 4) {
        setHomeHeroCards(saved.map((c) => ({ label: c.label || "", image: typeof c.image === "string" ? c.image : "" })))
      }

      setSaveSuccess("Home hero cards saved.")
      setTimeout(() => setSaveSuccess(""), 2000)
    } catch (err) {
      setError("Failed to save home hero cards")
      console.error(err)
    } finally {
      setIsSavingHome(false)
    }
  }

  const resetHomeContent = async () => {
    const defaults = cloneDefaultHomeHeroCards()
    setHomeHeroCards(defaults)
    setSaveSuccess("")
    setError("")
    try {
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
      if (!accessToken) {
        navigate("/login")
        return
      }

      await saveHomeHeroCardsApi(accessToken, defaults)
      setSaveSuccess("Home hero cards reset to defaults and saved.")
      setTimeout(() => setSaveSuccess(""), 2000)
    } catch (err) {
      setError("Failed to save default home hero cards")
      console.error(err)
    }
  }

  const saveAboutContent = () => {
    setIsSavingAbout(true)
    setSaveSuccess("")
    setSaveSuccess("About image updated (not persisted yet).")
    setTimeout(() => setSaveSuccess(""), 2000)
    setIsSavingAbout(false)
  }

  const resetAboutContent = () => {
    setAboutStoryImage(DEFAULT_ABOUT_STORY_IMAGE)
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
    setContactBusinessHoursImage(DEFAULT_CONTACT_BUSINESS_HOURS_IMAGE)
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

          {activeTab === "welcome" && <Welcome adminProfile={adminProfile} />}

          {activeTab === "conversations" && (
            <Conversations
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
            <Settings
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
            <HomeEditor
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
            <AboutEditor
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
            <ContactEditor
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

          {activeTab === "comingSoon" && <ComingSoon />}
        </div>
      </div>
    </div>
  )
}
