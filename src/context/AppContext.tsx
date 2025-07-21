// src/context/AppContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// Define the shape of our global state
type AppContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  uploadStatus: string
  setUploadStatus: (status: string) => void
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('idle')

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        uploadStatus,
        setUploadStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
