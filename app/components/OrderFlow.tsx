"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Check, Globe, Code, Layout, Cpu, Cloud, ShieldCheck, CreditCard, ShoppingCart, Upload, File as FileIcon, Loader2 } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { cn } from "@/lib/utils"

type Step = "service" | "details" | "package" | "payment"

const SERVICES_ICONS = {
  web: Globe,
  mobile: Code,
  design: Layout,
  ai: Cpu,
  cloud: Cloud,
  security: ShieldCheck,
}

export default function OrderFlow({
  isOpen,
  onClose,
  preselectedService = null,
  preselectedPackage = null
}: {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string | null;
  preselectedPackage?: string | null;
}) {
  const { t, language } = useLanguage()
  const [step, setStep] = useState<Step>(preselectedService ? "details" : "service")
  const [selectedService, setSelectedService] = useState<string | null>(preselectedService)
  const [projectDetails, setProjectDetails] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<string | null>(preselectedPackage)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadWarning, setUploadWarning] = useState<string | null>(null)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService)
      setStep("details")
    }
    if (preselectedPackage) {
      setSelectedPackage(preselectedPackage)
    }
  }, [preselectedService, preselectedPackage, isOpen])

  const steps: Step[] = ["service", "details", "package", "payment"]
  const currentStepIndex = steps.indexOf(step)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleNext = async () => {
    if (step === "service" && selectedService) setStep("details")
    else if (step === "details" && projectDetails.length > 10 && customerEmail.includes("@")) setStep("package")
    else if (step === "package" && selectedPackage) {
      setIsUploading(true)
      setUploadWarning(null)
      try {
        let fileUrl = null

        if (file) {
          try {
            const formData = new FormData()
            formData.append("file", file)

            const uploadResponse = await fetch("/api/upload-file", {
              method: "POST",
              body: formData,
            })
            const uploadPayload = await uploadResponse.json()

            if (!uploadResponse.ok) {
              throw new Error(uploadPayload?.error || "File upload failed")
            }

            fileUrl = uploadPayload?.filePath || null
          } catch (error) {
            console.error("Upload failed:", JSON.stringify(error, null, 2))
            setUploadWarning("Your file could not be uploaded, but you can continue to payment.")
          }
        }

        try {
          const orderData = {
            description: projectDetails,
            file_url: fileUrl,
            plan: selectedPackage,
            customer_email: customerEmail,
            service: selectedService,
            language: language,
            status: "pending"
          }

          const createOrderResponse = await fetch("/api/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...orderData,
              id: orderId ?? undefined,
            })
          })

          const result = await createOrderResponse.json()

          if (!createOrderResponse.ok) {
            console.error(result.error)
            throw new Error("Failed to create order")
          }

          const res = { data: result.data, error: null }

          if (res.error) {
            console.error("Supabase error detail:", JSON.stringify(res.error, null, 2))
            throw res.error
          }
          if (res.data) setOrderId(res.data.id)
        } catch (error: unknown) {
          console.error("Saving order failed full error:", error)
          console.error("Saving order failed (JSON):", JSON.stringify(error, null, 2))
          if (error instanceof Error && error.message) {
            console.error("Error message:", error.message)
          }
          if (typeof error === "object" && error !== null && "details" in error) {
            console.error("Error details:", (error as Record<string, unknown>).details)
          }
          if (typeof error === "object" && error !== null && "hint" in error) {
            console.error("Error hint:", (error as Record<string, unknown>).hint)
          }
          if (!uploadWarning) {
            setUploadWarning("We could not save your project details right now, but you can continue to payment.")
          }
        }

        setStep("payment")
      } catch (error) {
        console.error("Error processing order:", JSON.stringify(error, null, 2))
        setStep("payment")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleCheckout = async (provider: "stripe" | "paypal") => {
    if (!selectedPackage || !orderId) {
      setPaymentError("Please select a package before continuing.")
      return
    }

    setIsCreatingCheckout(true)
    setPaymentError(null)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          orderId,
          plan: selectedPackage,
          service: selectedService,
          details: projectDetails,
          email: customerEmail,
          language,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Failed to start checkout")
      }

      window.location.href = payload.url as string
    } catch (error) {
      console.error("Checkout failed:", JSON.stringify(error, null, 2))
      setPaymentError("Unable to start checkout. Please try again.")
    } finally {
      setIsCreatingCheckout(false)
    }
  }

  const handleBack = () => {
    if (step === "details") setStep("service")
    else if (step === "package") setStep("details")
    else if (step === "payment") setStep("package")
  }

  const reset = () => {
    setStep("service")
    setSelectedService(null)
    setProjectDetails("")
    setCustomerEmail("")
    setSelectedPackage(null)
    setFile(null)
    setUploadWarning(null)
    setPaymentError(null)
    setIsCreatingCheckout(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { onClose(); reset(); }}
          className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.order.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      steps.indexOf(s) <= currentStepIndex ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                    )} />
                    {i < steps.length - 1 && <div className="w-4 h-[1px] bg-gray-100 dark:border-gray-800" />}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => { onClose(); reset(); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {step === "service" && (
                <motion.div
                  key="service"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {(Object.keys(t.services.items) as Array<keyof typeof t.services.items>).map((key) => {
                    const Icon = SERVICES_ICONS[key] || Globe
                    const isSelected = selectedService === key
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedService(key)}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all group",
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                            : "border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                          isSelected ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-blue-600"
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white mb-1">{t.services.items[key].title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{t.services.items[key].desc}</div>
                      </button>
                    )
                  })}
                </motion.div>
              )}

              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.contact.email}</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.order.steps.details}</label>
                      <textarea
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        placeholder={t.order.placeholders.details}
                        rows={5}
                        className="w-full p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                      />
                      <div className="text-right text-xs text-gray-400">
                        {projectDetails.length} characters (min 10)
                      </div>
                    </div>
                  </div>

                  {/* FILE UPLOAD */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.order.fileUpload.label}</label>
                    {!file ? (
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
                        />
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white">Click or drag to upload</p>
                            <p className="text-sm text-gray-500">{t.order.fileUpload.hint}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center text-blue-600">
                            <FileIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFile(null)}
                          className="p-2 hover:bg-white dark:hover:bg-gray-900 rounded-lg text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === "package" && (
                <motion.div
                  key="package"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {["basic", "pro", "enterprise"].map((pkg) => {
                    const p = t.pricing[pkg as keyof typeof t.pricing] as any
                    const isSelected = selectedPackage === pkg
                    return (
                      <button
                        key={pkg}
                        onClick={() => setSelectedPackage(pkg)}
                        className={cn(
                          "p-8 rounded-3xl border-2 text-left transition-all relative overflow-hidden",
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-xl"
                            : "border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{p.name}</div>
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">{t.pricing.currency}{p.price}</span>
                        </div>
                        <ul className="space-y-3">
                          {p.features.slice(0, 3).map((f: string) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Check className="w-4 h-4 text-green-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    )
                  })}
                </motion.div>
              )}

              {step === "package" && uploadWarning && (
                <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">{uploadWarning}</p>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-md mx-auto space-y-8"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.order.steps.payment}</h3>
                    <p className="text-gray-500">Choose your preferred payment method to secure your project slot.</p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => handleCheckout("stripe")}
                      disabled={isCreatingCheckout || !selectedPackage}
                      className="w-full p-6 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-between hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="w-6 h-6" />
                        {isCreatingCheckout ? "Redirecting..." : "Pay with Stripe"}
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCheckout("paypal")}
                      disabled={isCreatingCheckout || !selectedPackage}
                      className="w-full p-6 bg-[#FFC439] text-gray-900 font-bold rounded-2xl flex items-center justify-between hover:bg-[#E1AD2A] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <div className="flex items-center gap-4">
                        <ShoppingCart className="w-6 h-6" />
                        {isCreatingCheckout ? "Redirecting..." : "Pay with PayPal"}
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {paymentError && (
                      <p className="text-sm text-red-600 dark:text-red-400">{paymentError}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === "service" || isUploading}
              className={cn(
                "flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50",
                step === "service" && "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              {t.order.back}
            </button>

            {step !== "payment" && (
              <button
                onClick={handleNext}
                disabled={
                  isUploading ||
                  (step === "service" && !selectedService) ||
                  (step === "details" && (projectDetails.length < 10 || !customerEmail.includes("@"))) ||
                  (step === "package" && !selectedPackage)
                }
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-blue-500/20 min-w-[140px] justify-center"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t.order.next}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
