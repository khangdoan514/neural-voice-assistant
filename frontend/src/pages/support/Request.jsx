import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

const sectionStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
}

function Section({ children, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-6% 0px" })

  return (
    <motion.div
      ref={ref}
      variants={sectionStagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ label, title, titleHighlight, description = "" }) {
  return (
    <>
      <motion.div variants={reveal} className="mb-4">
        <motion.div variants={reveal} className="flex items-center gap-3 mb-5 font-label font-section-label font-bold tracking-[4px] uppercase text-rust">
          <span className="block w-8 h-0.5 bg-rust" />
          {label}
        </motion.div>
        <motion.h2 variants={reveal} className="font-display text-title leading-none text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {title} {titleHighlight && <span className="text-rust">{titleHighlight}</span>}
        </motion.h2>
      </motion.div>
      <motion.p variants={reveal} className="text-sm sm:text-md text-muted leading-relaxed mb-8 sm:mb-12 md:mb-16 font-light">
        {description}
      </motion.p>
    </>
  )
}

export default function Request() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "Texas",
    zipCode: "",
    country: "USA",
    serviceDate: "",
    requestMessage: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const navigate = useNavigate()

  // State options
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ]

  // Country options
  const countries = ["USA", "Canada", "Mexico"]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    
    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.streetAddress) newErrors.streetAddress = "Street address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipCode) newErrors.zipCode = "Zip code is required"
    if (!formData.country) newErrors.country = "Country is required"
    
    if (!formData.serviceDate) newErrors.serviceDate = "Preferred service date is required"
    
    if (!formData.requestMessage) {
      newErrors.requestMessage = "Please describe your request"
    } else if (formData.requestMessage.length < 10) {
      newErrors.requestMessage = "Please provide more details (at least 10 characters)"
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      setErrors({})
      
      setTimeout(() => {
        console.log("Request submitted:", formData)
        setSubmitSuccess(true)
        setIsLoading(false)
        
        setTimeout(() => {
          setSubmitSuccess(false)
          setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "Texas",
            zipCode: "",
            country: "USA",
            serviceDate: "",
            requestMessage: ""
          })
          navigate("/")
        }, 2000)
      }, 1500)
    } else {
      setErrors(newErrors)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  return (
    <main className="bg-barn min-h-screen pt-16 overflow-x-hidden">
      <div className="max-w-full overflow-x-hidden">
        <div className="bg-foreground py-14 sm:py-18 md:py-22 lg:py-24 px-6 sm:px-10 md:px-14 lg:px-24 relative overflow-hidden">
          <div className="support-band-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="support-band-glow pointer-events-none absolute inset-0" aria-hidden />
          <motion.div
            className="relative"
            variants={sectionStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={reveal} className="flex items-center gap-3 mb-5 font-label text-section-label font-bold tracking-[4px] uppercase text-rust">
              <span className="block w-8 h-0.5 bg-rust" />
              Support
            </motion.div>
            <motion.h1 variants={reveal} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-hero leading-[1.1] sm:leading-[0.92] text-paper mb-4">
              Service <span className="text-rust">Request</span>
            </motion.h1>
            <motion.p variants={reveal} className="font-label text-xs sm:text-sm md:text-md tracking-[2px] sm:tracking-[3px] uppercase text-paper/40 mt-4">
              Tell us what you need and we will follow up quickly
            </motion.p>
          </motion.div>
        </div>

        <div className="px-6 sm:px-10 md:px-14 lg:px-24 py-14 sm:py-18 md:py-22 lg:py-24">
          <Section>
            <SectionHeader
              label="Get Started"
              title="Submit a "
              titleHighlight="Request"
              description="Complete the form below and our team will contact you to confirm details and schedule service."
            />

            {submitSuccess && (
              <motion.div variants={reveal} className="bg-green-500/10 border border-green-500/30 text-green-500 px-3 py-2 rounded-lg text-sm text-center mb-6">
                ✓ Request submitted successfully! Redirecting...
              </motion.div>
            )}

            <motion.form variants={reveal} className="space-y-3" onSubmit={handleSubmit}>
          {/* Name Row - First & Last */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm sm:text-base font-label text-foreground mb-1">
                First Name <span className="text-rust">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.firstName ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="John"
              />
              {errors.firstName && <p className="mt-0.5 text-xs text-red-500">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm sm:text-base font-label text-foreground mb-1">
                Last Name <span className="text-rust">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.lastName ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-0.5 text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone" className="block text-sm sm:text-base font-label text-foreground mb-1">
                Phone Number <span className="text-rust">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.phone ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="(903) 555-0123"
              />
              {errors.phone && <p className="mt-0.5 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-label text-foreground mb-1">
                Email Address <span className="text-rust">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.email ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="john.doe@example.com"
              />
              {errors.email && <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="streetAddress" className="block text-sm sm:text-base font-label text-foreground mb-1">
                Street Address <span className="text-rust">*</span>
              </label>
              <input
                id="streetAddress"
                name="streetAddress"
                type="text"
                value={formData.streetAddress}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.streetAddress ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="123 Farm Road"
              />
              {errors.streetAddress && <p className="mt-0.5 text-xs text-red-500">{errors.streetAddress}</p>}
            </div>

            <div>
              <label htmlFor="streetAddress2" className="block text-sm sm:text-base font-label text-foreground mb-1">
                Street Address Line 2 <span className="text-muted">(Optional)</span>
              </label>
              <input
                id="streetAddress2"
                name="streetAddress2"
                type="text"
                value={formData.streetAddress2}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-paper border border-rust/30 rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors"
                placeholder="Apt, Suite, Unit, etc."
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="city" className="block text-sm sm:text-base font-label text-foreground mb-1">
                City <span className="text-rust">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.city ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="Center"
              />
              {errors.city && <p className="mt-0.5 text-xs text-red-500">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm sm:text-base font-label text-foreground mb-1">
                State <span className="text-rust">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.state ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm focus:outline-none focus:border-rust transition-colors`}
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="mt-0.5 text-xs text-red-500">{errors.state}</p>}
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm sm:text-base font-label text-foreground mb-1">
                ZIP Code <span className="text-rust">*</span>
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.zipCode ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="75935"
              />
              {errors.zipCode && <p className="mt-0.5 text-xs text-red-500">{errors.zipCode}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm sm:text-base font-label text-foreground mb-1">
                Country <span className="text-rust">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-paper border ${
                  errors.country ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-foreground text-sm focus:outline-none focus:border-rust transition-colors`}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <p className="mt-0.5 text-xs text-red-500">{errors.country}</p>}
            </div>
          </div>

          {/* Service Date */}
          <div>
            <label htmlFor="serviceDate" className="block text-sm sm:text-base font-label text-foreground mb-1">
              Preferred Service Date <span className="text-rust">*</span>
            </label>
            <input
              id="serviceDate"
              name="serviceDate"
              type="date"
              value={formData.serviceDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 bg-paper border ${
                errors.serviceDate ? 'border-rust' : 'border-rust/30'
              } rounded-lg text-foreground text-sm focus:outline-none focus:border-rust transition-colors`}
            />
            {errors.serviceDate && <p className="mt-0.5 text-xs text-red-500">{errors.serviceDate}</p>}
          </div>

          {/* Request Message */}
          <div>
            <label htmlFor="requestMessage" className="block text-sm sm:text-base font-label text-foreground mb-1">
              Service Request Details <span className="text-rust">*</span>
            </label>
            <textarea
              id="requestMessage"
              name="requestMessage"
              rows={3}
              value={formData.requestMessage}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-paper border ${
                errors.requestMessage ? 'border-rust' : 'border-rust/30'
              } rounded-lg text-foreground text-sm placeholder-muted/50 focus:outline-none focus:border-rust transition-colors resize-vertical`}
              placeholder="Please describe what you need help with..."
            />
            {errors.requestMessage && <p className="mt-0.5 text-xs text-red-500">{errors.requestMessage}</p>}
          </div>

          {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-paper bg-rust hover:bg-rust-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rust disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-paper" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Submit Request"
                )}
              </button>

              {/* Note */}
              <p className="text-center text-xs text-muted">
                Our team typically responds within 24-48 hours
              </p>
            </motion.form>
          </Section>
        </div>
      </div>
    </main>
  )
}