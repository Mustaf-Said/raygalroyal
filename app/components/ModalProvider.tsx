"use client"

import { createContext, useContext, useState } from "react"
import OrderFlow from "./OrderFlow"

type ModalContextType = {
  isOrderModalOpen: boolean
  openOrderModal: (service?: string | null, pkg?: string | null) => void
  closeOrderModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [preselectedService, setPreselectedService] = useState<string | null>(null)
  const [preselectedPackage, setPreselectedPackage] = useState<string | null>(null)

  const openOrderModal = (service: string | null = null, pkg: string | null = null) => {
    setPreselectedService(service)
    setPreselectedPackage(pkg)
    setIsOrderModalOpen(true)
  }
  
  const closeOrderModal = () => {
    setIsOrderModalOpen(false)
    setPreselectedService(null)
    setPreselectedPackage(null)
  }

  return (
    <ModalContext.Provider value={{ isOrderModalOpen, openOrderModal, closeOrderModal }}>
      {children}
      <OrderFlow 
        isOpen={isOrderModalOpen} 
        onClose={closeOrderModal} 
        preselectedService={preselectedService}
        preselectedPackage={preselectedPackage}
      />
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
