// src/context/useAppContext.ts

'use client' // ✅ Marks this as a client-side hook

import { useContext } from 'react'
import AppContext from './AppContext'

// ✅ Custom hook to access global context
// 💬 "This lets any component access the shared state using a clean one-liner"
export function useAppContext() {
  const context = useContext(AppContext)

  // ✅ Runtime guard to ensure hook is used inside a Provider
  // 💬 "Prevents accidental usage outside the AppProvider, helps catch bugs early"
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context // ✅ Returns { isAuthenticated, uploadStatus, ... }
}
