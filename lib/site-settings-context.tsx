'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { apiClient, type ContentSection } from '@/lib/api-client'
import { defaultSiteSettings, getSiteSettingsFromSection, type SiteSettings } from '@/lib/site-settings'

type SiteSettingsContextType = {
  settings: SiteSettings
  section: ContentSection | null
  isLoading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSiteSettings,
  section: null,
  isLoading: true,
})

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<ContentSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const content = await apiClient.getSiteContent()
        const siteSettingsSection = content.sections.find((item) => item.key === 'site_settings') || null
        setSection(siteSettingsSection)
      } catch (error) {
        console.error('Failed to load site settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSiteSettings()
  }, [])

  const value = useMemo(
    () => ({
      settings: getSiteSettingsFromSection(section),
      section,
      isLoading,
    }),
    [section, isLoading]
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
