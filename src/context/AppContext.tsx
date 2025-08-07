// src/context/AppContext.tsx

'use client' // ✅ Ensures this file is client-side only for React state

import { createContext, useContext, useState, ReactNode } from 'react'

// ✅ Define the context shape
// 💬 "This defines the values we'll share across components using React Context"
type AppContextType = {
  isAuthenticated: boolean                 // 💬 "Tracks if user is logged in"
  setIsAuthenticated: (value: boolean) => void

  uploadStatus: string                     // 💬 "Tracks current ETL upload state"
  setUploadStatus: (status: string) => void
}

// ✅ Create the context with optional typing
// 💬 "We default to undefined, enforcing that components must be wrapped in the Provider"
const AppContext = createContext<AppContextType | undefined>(undefined)

// ✅ AppProvider component to wrap the app
// 💬 "This component wraps our app and holds the shared global state"
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('idle')

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,       // ✅ Shared login state
        setIsAuthenticated,
        uploadStatus,          // ✅ Shared ETL upload state
        setUploadStatus,
      }}
    >
      {children}               // ✅ Render all children with access to this state
    </AppContext.Provider>
  )
}

export default AppContext
