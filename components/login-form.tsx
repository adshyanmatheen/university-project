"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [cancelMousePosition, setCancelMousePosition] = useState({ x: 0, y: 0 })
  const [isCancelHovering, setIsCancelHovering] = useState(false)
  const [emailMousePosition, setEmailMousePosition] = useState({ x: 0, y: 0 })
  const [isEmailHovering, setIsEmailHovering] = useState(false)
  const [passwordMousePosition, setPasswordMousePosition] = useState({ x: 0, y: 0 })
  const [isPasswordHovering, setIsPasswordHovering] = useState(false)
  const [emailErrorMousePosition, setEmailErrorMousePosition] = useState({ x: 0, y: 0 })
  const [isEmailErrorHovering, setIsEmailErrorHovering] = useState(false)
  const [passwordErrorMousePosition, setPasswordErrorMousePosition] = useState({ x: 0, y: 0 })
  const [isPasswordErrorHovering, setIsPasswordErrorHovering] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLDivElement>(null)
  const emailErrorRef = useRef<HTMLParagraphElement>(null)
  const passwordErrorRef = useRef<HTMLParagraphElement>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent, setter: (pos: { x: number; y: number }) => void, ref: React.RefObject<HTMLElement>) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setter({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    },
    [],
  )

  useEffect(() => {
    const container = containerRef.current
    const cancelButton = cancelRef.current
    const emailInput = emailRef.current
    const passwordContainer = passwordRef.current
    const emailError = emailErrorRef.current
    const passwordError = passwordErrorRef.current

    const handlers = {
      container: {
        mousemove: (e: MouseEvent) => handleMouseMove(e, setMousePosition, containerRef),
        mouseenter: () => setIsHovering(true),
        mouseleave: () => setIsHovering(false),
      },
      cancel: {
        mousemove: (e: MouseEvent) => handleMouseMove(e, setCancelMousePosition, cancelRef),
        mouseenter: () => setIsCancelHovering(true),
        mouseleave: () => setIsCancelHovering(false),
      },
      email: {
        mousemove: (e: MouseEvent) => handleMouseMove(e, setEmailMousePosition, emailRef),
        mouseenter: () => setIsEmailHovering(true),
        mouseleave: () => setIsEmailHovering(false),
      },
      password: {
        mousemove: (e: MouseEvent) => handleMouseMove(e, setPasswordMousePosition, passwordRef),
        mouseenter: () => setIsPasswordHovering(true),
        mouseleave: () => setIsPasswordHovering(false),
      },
      emailError: {
        mousemove: (e: MouseEvent) => handleMouseMove(e, setEmailErrorMousePosition, emailErrorRef),
        mouseenter: () => setIsEmailErrorHovering(true),
        mouseleave: () => setIsEmailErrorHovering(false),
      },
      passwordError: {
        mousemove: (e: MouseEvent) => handleMouseMove(e, setPasswordErrorMousePosition, passwordErrorRef),
        mouseenter: () => setIsPasswordErrorHovering(true),
        mouseleave: () => setIsPasswordErrorHovering(false),
      },
    }

    // Add event listeners
    if (container) {
      Object.entries(handlers.container).forEach(([event, handler]) => {
        container.addEventListener(event, handler as EventListener)
      })
    }

    if (cancelButton) {
      Object.entries(handlers.cancel).forEach(([event, handler]) => {
        cancelButton.addEventListener(event, handler as EventListener)
      })
    }

    if (emailInput) {
      Object.entries(handlers.email).forEach(([event, handler]) => {
        emailInput.addEventListener(event, handler as EventListener)
      })
    }

    if (passwordContainer) {
      Object.entries(handlers.password).forEach(([event, handler]) => {
        passwordContainer.addEventListener(event, handler as EventListener)
      })
    }

    if (emailError) {
      Object.entries(handlers.emailError).forEach(([event, handler]) => {
        emailError.addEventListener(event, handler as EventListener)
      })
    }

    if (passwordError) {
      Object.entries(handlers.passwordError).forEach(([event, handler]) => {
        passwordError.addEventListener(event, handler as EventListener)
      })
    }

    return () => {
      if (container) {
        Object.entries(handlers.container).forEach(([event, handler]) => {
          container.removeEventListener(event, handler as EventListener)
        })
      }
      if (cancelButton) {
        Object.entries(handlers.cancel).forEach(([event, handler]) => {
          cancelButton.removeEventListener(event, handler as EventListener)
        })
      }
      if (emailInput) {
        Object.entries(handlers.email).forEach(([event, handler]) => {
          emailInput.removeEventListener(event, handler as EventListener)
        })
      }
      if (passwordContainer) {
        Object.entries(handlers.password).forEach(([event, handler]) => {
          passwordContainer.removeEventListener(event, handler as EventListener)
        })
      }
      if (emailError) {
        Object.entries(handlers.emailError).forEach(([event, handler]) => {
          emailError.removeEventListener(event, handler as EventListener)
        })
      }
      if (passwordError) {
        Object.entries(handlers.passwordError).forEach(([event, handler]) => {
          passwordError.removeEventListener(event, handler as EventListener)
        })
      }
    }
  }, [handleMouseMove])

  const validateForm = (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Login successful")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGlassStyle = (mousePos: { x: number; y: number }, isVisible: boolean) => {
    if (!isVisible) return {}

    return {
      background: `
        radial-gradient(ellipse 100px 60px at ${mousePos.x}px ${mousePos.y}px, 
          rgba(255,255,255,0.18) 0%, 
          rgba(255,255,255,0.08) 30%, 
          rgba(255,255,255,0.04) 50%,
          transparent 70%),
        radial-gradient(ellipse 50px 30px at ${mousePos.x - 15}px ${mousePos.y - 10}px, 
          rgba(255,255,255,0.22) 0%, 
          rgba(255,255,255,0.1) 40%, 
          transparent 70%)
      `,
      mask: `linear-gradient(white, white) content-box, linear-gradient(white, white)`,
      maskComposite: "xor" as const,
      WebkitMask: `linear-gradient(white, white) content-box, linear-gradient(white, white)`,
      WebkitMaskComposite: "xor" as const,
      padding: "1px",
      filter: "blur(0.8px) contrast(1.1)",
    }
  }

  const getRedGlassStyle = (mousePos: { x: number; y: number }, isVisible: boolean) => {
    if (!isVisible) return {}

    return {
      background: `
        radial-gradient(ellipse 60px 40px at ${mousePos.x}px ${mousePos.y}px, 
          rgba(239,68,68,0.15) 0%, 
          rgba(239,68,68,0.08) 30%, 
          rgba(239,68,68,0.04) 50%,
          transparent 70%),
        radial-gradient(ellipse 30px 20px at ${mousePos.x - 10}px ${mousePos.y - 8}px, 
          rgba(239,68,68,0.18) 0%, 
          rgba(239,68,68,0.1) 40%, 
          transparent 70%)
      `,
      mask: `linear-gradient(white, white) content-box, linear-gradient(white, white)`,
      maskComposite: "xor" as const,
      WebkitMask: `linear-gradient(white, white) content-box, linear-gradient(white, white)`,
      WebkitMaskComposite: "xor" as const,
      padding: "1px",
      filter: "blur(0.6px) contrast(1.1)",
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 0px rgba(255,255,255,0); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.1); }
        }
        
        @keyframes subtlePulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.8; 
          }
          50% { 
            transform: scale(1.1); 
            opacity: 1; 
          }
        }
      `}</style>
``
      <div className={cn("flex flex-col gap-6 sm:gap-8 w-full max-w-md mx-auto", className)} {...props}>
        <div className="text-center">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-light tracking-normal relative"
            style={{
              animation: "textGlow 6s ease-in-out infinite",
            }}
          >
            Login to your Certara
            <span
              className="inline-block w-1 h-1 bg-white rounded-full ml-0.5 mr-1"
              style={{
                animation: "subtlePulse 4s ease-in-out infinite",
              }}
            />
             <span className="pl-1">account</span>
          </h1>
        </div>

        <div
          ref={containerRef}
          className="relative rounded-xl p-6 sm:p-8 overflow-visible border border-white/20 transition-all duration-300 backdrop-blur-sm"
        >
          {isHovering && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
              style={getGlassStyle(mousePosition, isHovering)}
            />
          )}

          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={cn(
                      "bg-transparent border transition-all duration-300 rounded-lg text-white placeholder:text-white/50 h-12 px-4 focus:ring-2 focus:ring-white/20 focus:ring-offset-0",
                      errors.email
                        ? "border-red-400/60 focus:border-red-400/80"
                        : "border-white/20 focus:border-white/40",
                    )}
                  />
                  {isEmailHovering && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                      style={getGlassStyle(emailMousePosition, isEmailHovering)}
                    />
                  )}
                </div>
                {errors.email && (
                  <div className="relative">
                    <p
                      ref={emailErrorRef}
                      id="email-error"
                      className="relative text-red-400 text-xs mt-1 p-2 rounded-lg bg-red-500/10 border border-red-400/20 backdrop-blur-sm overflow-hidden"
                      role="alert"
                    >
                      {isEmailErrorHovering && (
                        <div
                          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                          style={getRedGlassStyle(emailErrorMousePosition, isEmailErrorHovering)}
                        />
                      )}
                      <span className="relative z-10">{errors.email}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password" className="text-white text-sm font-medium">
                  Password
                </Label>
                <div ref={passwordRef} className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={cn(
                      "bg-transparent border transition-all duration-300 rounded-lg text-white placeholder:text-white/50 pr-12 h-12 px-4 focus:ring-2 focus:ring-white/20 focus:ring-offset-0",
                      errors.password
                        ? "border-red-400/60 focus:border-red-400/80"
                        : "border-white/20 focus:border-white/40",
                    )}
                  />
                  {isPasswordHovering && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                      style={getGlassStyle(passwordMousePosition, isPasswordHovering)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all duration-300 hover:scale-110 z-20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 transition-all duration-300" />
                    ) : (
                      <Eye className="h-5 w-5 transition-all duration-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="relative">
                    <p
                      ref={passwordErrorRef}
                      id="password-error"
                      className="relative text-red-400 text-xs mt-1 p-2 rounded-lg bg-red-500/10 border border-red-400/20 backdrop-blur-sm overflow-hidden"
                      role="alert"
                    >
                      {isPasswordErrorHovering && (
                        <div
                          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                          style={getRedGlassStyle(passwordErrorMousePosition, isPasswordErrorHovering)}
                        />
                      )}
                      <span className="relative z-10">{errors.password}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-2">
                <Button
                  ref={cancelRef}
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1 relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:backdrop-blur-lg transition-all duration-300 rounded-lg text-white hover:text-white h-12 focus:ring-2 focus:ring-white/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelHovering && !isLoading && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                      style={getGlassStyle(cancelMousePosition, isCancelHovering)}
                    />
                  )}
                  <span className="relative z-10">Cancel</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-lg h-12 font-medium focus:ring-2 focus:ring-white/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              <span className="text-white/70">Don&apos;t have an account? </span>
              <a
                href="/contact-us"
                className="underline underline-offset-4 text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0 rounded"
              >
                Contact us
              </a>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-white/40 space-y-2">
          <p>© 2025 Certera. All rights reserved.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="#"
              className="hover:text-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0 rounded"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="#"
              className="hover:text-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0 rounded"
            >
              Terms of Service
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="#"
              className="hover:text-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0 rounded"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
