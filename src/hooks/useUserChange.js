import { useEffect } from 'react'

/**
 * Hook to detect when the user changes (login/logout)
 * Triggers a callback whenever the auth token or user changes
 */
export function useUserChange(callback) {
  useEffect(() => {
    const handleStorageChange = () => {
      callback()
    }

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange)

    // Also listen for changes from the same tab (using custom event)
    window.addEventListener('userChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChanged', handleStorageChange)
    }
  }, [callback])
}

/**
 * Dispatch event when user changes (to be called after login/logout)
 */
export function dispatchUserChangeEvent() {
  const event = new CustomEvent('userChanged')
  window.dispatchEvent(event)
}
