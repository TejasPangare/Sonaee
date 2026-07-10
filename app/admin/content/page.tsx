'use client'

import { useEffect, useState } from 'react'

import { AdminShell } from '@/components/admin/admin-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GalleryCategoryManager } from '@/components/admin/gallery-category-manager'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { useAdmin } from '@/lib/admin-context'
import { apiClient } from '@/lib/api-client'
import {
  defaultSiteSettings,
  getSiteSettingsFromSection,
  getSiteSettingsMetadata,
  type SiteSettings,
} from '@/lib/site-settings'

const sectionKey = 'site_settings'

type AdminUserForm = {
  full_name: string
  email: string
  password: string
  is_superadmin: boolean
}

const defaultAdminUserForm: AdminUserForm = {
  full_name: '',
  email: '',
  password: '',
  is_superadmin: false,
}

export default function AdminContentPage() {
  const { token, user } = useAdmin()
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [adminForm, setAdminForm] = useState<AdminUserForm>(defaultAdminUserForm)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')

  useEffect(() => {
    if (!token) return
    const authToken = token

    async function loadContent() {
      try {
        const sections = await apiClient.getContentSections(authToken)
        const section = sections.find((item) => item.key === sectionKey)
        setSettings(getSiteSettingsFromSection(section))
      } catch (error) {
        console.error('Failed to load site settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [token])

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const handleSave = async () => {
    if (!token) return

    setIsSaving(true)
    setMessage('')

    try {
      await apiClient.upsertContentSection(
        sectionKey,
        {
          key: sectionKey,
          title: settings.hotelName,
          subtitle: settings.shortName,
          description: settings.description,
          metadata_json: JSON.stringify(getSiteSettingsMetadata(settings)),
          is_active: true,
        },
        token
      )
      setMessage('Site settings saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save site settings.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdminCreate = async () => {
    if (!token) return

    setIsCreatingAdmin(true)
    setAdminMessage('')

    try {
      await apiClient.registerAdmin(
        {
          email: adminForm.email,
          full_name: adminForm.full_name,
          password: adminForm.password,
          is_superadmin: adminForm.is_superadmin,
        },
        token
      )
      setAdminForm(defaultAdminUserForm)
      setAdminMessage('Admin user created.')
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Failed to create admin user.')
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Site Content</h1>
          <p className="text-muted-foreground">
            Update hotel identity, contact details, social links, maps, and shared footer data from one place.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shared Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading settings...</p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hotelName">Hotel Name</Label>
                    <Input id="hotelName" value={settings.hotelName} onChange={(e) => updateSetting('hotelName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Short Name</Label>
                    <Input id="shortName" value={settings.shortName} onChange={(e) => updateSetting('shortName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandLabel">Brand Label</Label>
                    <Input id="brandLabel" value={settings.brandLabel} onChange={(e) => updateSetting('brandLabel', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneDisplay">Phone Display</Label>
                    <Input id="phoneDisplay" value={settings.phoneDisplay} onChange={(e) => updateSetting('phoneDisplay', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" value={settings.phoneNumber} onChange={(e) => updateSetting('phoneNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" value={settings.whatsappNumber} onChange={(e) => updateSetting('whatsappNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInquiryRecipient">Contact Inquiry Recipient</Label>
                    <Input
                      id="contactInquiryRecipient"
                      value={settings.contactInquiryRecipient}
                      onChange={(e) => updateSetting('contactInquiryRecipient', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="banquetInquiryRecipient">Banquet Inquiry Recipient</Label>
                    <Input
                      id="banquetInquiryRecipient"
                      value={settings.banquetInquiryRecipient}
                      onChange={(e) => updateSetting('banquetInquiryRecipient', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={settings.address} onChange={(e) => updateSetting('address', e.target.value)} className="min-h-24" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Brand Description</Label>
                    <Textarea id="description" value={settings.description} onChange={(e) => updateSetting('description', e.target.value)} className="min-h-24" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessHours">Business Hours</Label>
                    <Input id="businessHours" value={settings.businessHours} onChange={(e) => updateSetting('businessHours', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="takeawayHours">Takeaway Hours</Label>
                    <Input id="takeawayHours" value={settings.takeawayHours} onChange={(e) => updateSetting('takeawayHours', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mapEmbedUrl">Google Map Embed URL</Label>
                    <Input id="mapEmbedUrl" value={settings.mapEmbedUrl} onChange={(e) => updateSetting('mapEmbedUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mapLink">Google Map Link</Label>
                    <Input id="mapLink" value={settings.mapLink} onChange={(e) => updateSetting('mapLink', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input id="instagramUrl" value={settings.instagramUrl} onChange={(e) => updateSetting('instagramUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input id="facebookUrl" value={settings.facebookUrl} onChange={(e) => updateSetting('facebookUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xUrl">X URL</Label>
                    <Input id="xUrl" value={settings.xUrl} onChange={(e) => updateSetting('xUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input id="youtubeUrl" value={settings.youtubeUrl} onChange={(e) => updateSetting('youtubeUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="copyrightText">Footer Copyright Line</Label>
                    <Input id="copyrightText" value={settings.copyrightText} onChange={(e) => updateSetting('copyrightText', e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                  {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <GalleryCategoryManager token={token} />

        <GalleryManager token={token} />

        {user?.is_superadmin ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Admin User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminFullName">Full Name</Label>
                  <Input
                    id="adminFullName"
                    value={adminForm.full_name}
                    onChange={(e) => setAdminForm((current) => ({ ...current, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm((current) => ({ ...current, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm((current) => ({ ...current, password: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={adminForm.is_superadmin}
                    onChange={(e) => setAdminForm((current) => ({ ...current, is_superadmin: e.target.checked }))}
                  />
                  Create as superadmin
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button onClick={handleAdminCreate} disabled={isCreatingAdmin}>
                  {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
                </Button>
                {adminMessage ? <p className="text-sm text-muted-foreground">{adminMessage}</p> : null}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AdminShell>
  )
}
