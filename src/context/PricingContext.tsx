'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type PlanType = 'student' | 'pro'

interface PricingContextType {
  activePlan: PlanType
  setActivePlan: (plan: PlanType) => void
}

const PricingContext = createContext<PricingContextType | undefined>(undefined)

export function PricingProvider({ children }: { children: ReactNode }) {
  const [activePlan, setActivePlan] = useState<PlanType>('student')

  return (
    <PricingContext.Provider value={{ activePlan, setActivePlan }}>
      {children}
    </PricingContext.Provider>
  )
}

export function usePricing() {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider')
  }
  return context
}
