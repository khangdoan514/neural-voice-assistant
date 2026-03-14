import Home from "./pages/Home"
import Services from "./pages/Services"
import Products from "./pages/Products"
import Pictures from "./pages/Pictures"
import Contact from "./pages/Contact"
import About from "./pages/About"
import Privacy from "./pages/Privacy"
import Login from "./pages/Login"
import Admin from "./pages/Admin"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import { Routes, Route, useLocation } from "react-router-dom"
import './index.css'

function AppContent() {
  const location = useLocation()
  const hideNavbarFooter = ['/login', '/admin'].includes(location.pathname)

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <ScrollToTop />
      <main className={!hideNavbarFooter ? "flex-grow" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pictures" element={<Pictures />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/services/construction" element={<Services />} />
          <Route path="/services/retro" element={<Services />} />
          <Route path="/services/shop" element={<Services />} />
          <Route path="/services/repair" element={<Services />} />

          <Route path="/products/feeding" element={<Products />} />
          <Route path="/products/watering" element={<Products />} />
          <Route path="/products/heating" element={<Products />} />
          <Route path="/products/cooling" element={<Products />} />
          <Route path="/products/fans" element={<Products />} />
          <Route path="/products/controllers" element={<Products />} />
          <Route path="/products/lighting" element={<Products />} />
          <Route path="/products/cleanout" element={<Products />} />
        </Routes>
      </main>
      {!hideNavbarFooter && <Footer />}
    </>
  )
}

export default function App() {
  return <AppContent />
}