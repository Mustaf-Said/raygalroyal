"use client"

import { createContext, useContext, useState, Suspense } from "react"
import OrderFlow from "./OrderFlow"
import SuccessModal from "./SuccessModal"

type ModalContextType = {
  isOrderModalOpen: boolean
  openOrderModal: (service?: string | null, pkg?: string | null, customAmount?: number | null) => void
  closeOrderModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [preselectedService, setPreselectedService] = useState<string | null>(null)
  const [preselectedPackage, setPreselectedPackage] = useState<string | null>(null)
  const [preselectedCustomAmount, setPreselectedCustomAmount] = useState<number | null>(null)

  const openOrderModal = (
    service: string | null = null,
    pkg: string | null = null,
    customAmount: number | null = null
  ) => {
    setPreselectedService(service)
    setPreselectedPackage(pkg)
    setPreselectedCustomAmount(customAmount)
    setIsOrderModalOpen(true)
  }

  const closeOrderModal = () => {
    setIsOrderModalOpen(false)
    setPreselectedService(null)
    setPreselectedPackage(null)
    setPreselectedCustomAmount(null)
  }

  return (
    <ModalContext.Provider value={{ isOrderModalOpen, openOrderModal, closeOrderModal }}>
      {children}
      <OrderFlow
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        preselectedService={preselectedService}
        preselectedPackage={preselectedPackage}
        preselectedCustomAmount={preselectedCustomAmount}
      />
      <Suspense>
        <SuccessModal />
      </Suspense>
    </ModalContext.Provider>
  )
}

export function useModals() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModals must be used within ModalProvider")
  }
  return context
}
