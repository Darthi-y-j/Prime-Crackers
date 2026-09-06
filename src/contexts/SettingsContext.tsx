import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_SETTINGS, getWebsiteSettings } from '@/services/settings'
import type { WebsiteSettings } from '@/types/database'

interface SettingsContextType {
  settings: WebsiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await getWebsiteSettings()
      setSettings(data)
    } catch {
      setSettings(DEFAULT_SETTINGS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  const value = useMemo(
    () => ({ settings, loading, refresh: loadSettings }),
    [settings, loading],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}
