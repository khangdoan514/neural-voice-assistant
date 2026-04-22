import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useLogin } from "../hooks/useLogin"

const easeDecel = [0.16, 1, 0.3, 1]
const tweenSoft = { type: "tween", duration: 0.45, ease: easeDecel }
const tweenSnap = { type: "tween", duration: 0.2, ease: easeDecel }

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const { login, isLoading, errors, clearFieldError } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(formData.email, formData.password, formData.rememberMe)
    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    clearFieldError(name)
  }

  const instant = reduceMotion ? { duration: 0 } : false
  const { staggerContainer, item } = useMemo(
    () => ({
      staggerContainer: {
        hidden: {},
        visible: {
          transition: {
            when: "beforeChildren",
            staggerChildren: reduceMotion ? 0 : 0.055,
            delayChildren: reduceMotion ? 0 : 0.04,
          },
        },
      },
      item: {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "tween", duration: reduceMotion ? 0 : 0.56, ease: easeDecel },
        },
      },
    }),
    [reduceMotion],
  )

  const inputClass = (hasError) =>
    [
      "w-full rounded-xl py-3.5 pl-11 pr-4 text-foreground placeholder:text-muted/40",
      "border bg-paper/95 shadow-none",
      "transition-[border-color] duration-200 ease-out",
      "focus:outline-none focus:ring-0 focus:border-rust",
      hasError ? "border-rust" : "border-rust/15 hover:border-rust/30",
    ].join(" ")

  return (
    <div className="relative min-h-screen overflow-hidden bg-barn">
      <div className="login-bg-grid pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -left-[12%] -top-[18%] h-[min(72vw,520px)] w-[min(72vw,520px)] rounded-full bg-rust/12 blur-3xl"
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 22],
                  y: [0, 16],
                  scale: [1, 1.03],
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: [0.45, 0, 0.55, 1],
          }}
        />
        <motion.div
          className="absolute -right-[8%] top-[22%] h-[min(64vw,480px)] w-[min(64vw,480px)] rounded-full bg-straw/28 blur-3xl"
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, -18],
                  y: [0, 22],
                }
          }
          transition={{
            duration: 26,
            repeat: Infinity,
            repeatType: "mirror",
            ease: [0.45, 0, 0.55, 1],
            delay: 0.8,
          }}
        />
        <motion.div
          className="absolute bottom-[-12%] left-[28%] h-[min(58vw,420px)] w-[min(58vw,420px)] rounded-full bg-rust-light/10 blur-3xl"
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 14],
                  y: [0, -18],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: [0.45, 0, 0.55, 1],
            delay: 0.4,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-10 xl:px-14">
          <motion.div
            className="relative w-full max-w-md"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={instant || { type: "tween", duration: 0.62, ease: easeDecel }}
          >
            <div className="relative rounded-2xl bg-gradient-to-br from-rust/35 via-rust/10 to-straw/25 p-[1px] shadow-[0_25px_60px_-15px_color-mix(in_srgb,var(--color-foreground)_18%,transparent)]">
              <div className="login-card-shine pointer-events-none absolute inset-0 rounded-2xl opacity-90" aria-hidden />

              <div className="relative overflow-hidden rounded-2xl border border-paper/70 bg-paper/95 p-9 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-paper)_85%,transparent)] backdrop-blur-md sm:p-10">
                <motion.div
                  className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-rust to-transparent"
                  initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={instant || { type: "tween", delay: 0.08, duration: 0.85, ease: easeDecel }}
                  style={{ transformOrigin: "center" }}
                />

                <motion.div
                  className="space-y-7 pt-1"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={item} className="space-y-3 text-center">
                    <motion.div
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-rust"
                      whileHover={reduceMotion ? {} : { scale: 1.04, y: -1 }}
                      whileTap={reduceMotion ? {} : { scale: 1.01 }}
                      transition={tweenSoft}
                    >
                      <LockClosedIcon className="h-7 w-7" aria-hidden />
                    </motion.div>
                    <div>
                      <h2 className="font-display text-4xl tracking-wide text-foreground">
                        Sign <span className="text-rust">in</span>
                      </h2>
                      <p className="mt-1.5 text-sm text-muted">Enter your credentials to continue</p>
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <AnimatePresence>
                      {errors.general && (
                        <motion.div
                          key="general-error"
                          role="alert"
                          initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                          transition={{ type: "tween", duration: reduceMotion ? 0 : 0.3, ease: easeDecel }}
                          className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-700"
                        >
                          {errors.general}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.form variants={item} className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-label text-muted">
                          Email address
                        </label>
                        <div className="relative">
                          <EnvelopeIcon
                            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted/45"
                            aria-hidden
                          />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass(!!errors.email)}
                            placeholder="admin@etpoultry.com"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={reduceMotion ? false : { opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
                              transition={{ type: "tween", duration: reduceMotion ? 0 : 0.24, ease: easeDecel }}
                              className="mt-1.5 text-xs text-red-600"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-label text-muted">
                          Password
                        </label>
                        <div className="relative">
                          <LockClosedIcon
                            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted/45"
                            aria-hidden
                          />
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`${inputClass(!!errors.password)} pr-12`}
                            placeholder="••••••••"
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-rust/8 hover:text-rust"
                            whileTap={reduceMotion ? {} : { scale: 0.96 }}
                            transition={tweenSnap}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={showPassword ? "hide" : "show"}
                                initial={reduceMotion ? false : { opacity: 0, rotate: -14 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={reduceMotion ? undefined : { opacity: 0, rotate: 14 }}
                                transition={{ type: "tween", duration: 0.22, ease: easeDecel }}
                                className="flex"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </motion.span>
                            </AnimatePresence>
                          </motion.button>
                        </div>
                        <AnimatePresence>
                          {errors.password && (
                            <motion.p
                              initial={reduceMotion ? false : { opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
                              transition={{ type: "tween", duration: reduceMotion ? 0 : 0.24, ease: easeDecel }}
                              className="mt-1.5 text-xs text-red-600"
                            >
                              {errors.password}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label
                          htmlFor="rememberMe"
                          className="group flex cursor-pointer select-none items-center gap-2.5 text-sm text-muted"
                        >
                          <span className="relative flex h-5 w-5 items-center justify-center">
                            <input
                              id="rememberMe"
                              name="rememberMe"
                              type="checkbox"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-rust/25 bg-paper transition-colors checked:border-rust checked:bg-rust focus:outline-none focus-visible:ring-2 focus-visible:ring-rust/40 focus-visible:ring-offset-2"
                            />
                            <svg
                              className="pointer-events-none absolute h-3 w-3 text-paper opacity-0 transition-opacity peer-checked:opacity-100"
                              viewBox="0 0 12 10"
                              fill="none"
                              aria-hidden
                            >
                              <path
                                d="M1 5.5L4.5 9L11 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          Remember me
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-sm font-medium text-rust underline-offset-2 transition-colors hover:text-rust-dark hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-rust to-rust-dark py-3.5 text-sm font-bold text-paper shadow-lg shadow-rust/30 transition-shadow duration-300 ease-out hover:shadow-xl hover:shadow-rust/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
                      whileHover={reduceMotion || isLoading ? {} : { scale: 1.01 }}
                      whileTap={reduceMotion || isLoading ? {} : { scale: 0.99 }}
                      transition={{ type: "tween", duration: 0.28, ease: easeDecel }}
                    >
                      <span
                        className="login-btn-sheen pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-paper/25 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[100%] group-hover:opacity-100"
                        aria-hidden
                      />
                      {isLoading ? (
                        <span className="relative flex justify-center">
                          <svg
                            className="h-5 w-5 animate-spin text-paper"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span className="relative">Sign in</span>
                      )}
                    </motion.button>
                  </motion.form>

                  <motion.div variants={item} className="text-center">
                    <Link
                      to="/"
                      className="login-back-link inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-rust"
                    >
                      <span className="login-back-arrow inline-flex items-center text-foreground">
                        ←
                      </span>
                      Back to home
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}