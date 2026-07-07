import { type ContentSection } from '@/lib/api-client'

export type SiteSettings = {
  hotelName: string
  shortName: string
  brandLabel: string
  logoText: string
  description: string
  phoneDisplay: string
  phoneNumber: string
  phoneHref: string
  whatsappNumber: string
  whatsappHref: string
  email: string
  emailHref: string
  contactInquiryRecipient: string
  banquetInquiryRecipient: string
  address: string
  mapEmbedUrl: string
  mapLink: string
  businessHours: string
  takeawayHours: string
  instagramUrl: string
  facebookUrl: string
  xUrl: string
  youtubeUrl: string
  copyrightText: string
}

type SiteSettingsMetadata = Partial<{
  shortName: string
  brandLabel: string
  logoText: string
  phoneDisplay: string
  phoneNumber: string
  whatsappNumber: string
  email: string
  contactInquiryRecipient: string
  banquetInquiryRecipient: string
  address: string
  mapEmbedUrl: string
  mapLink: string
  businessHours: string
  takeawayHours: string
  instagramUrl: string
  facebookUrl: string
  xUrl: string
  youtubeUrl: string
  copyrightText: string
}>

export const defaultSiteSettings: SiteSettings = {
  hotelName: 'Hotel Sonaee Veg',
  shortName: 'Sonaee Veg',
  brandLabel: 'Restaurant',
  logoText: 'SV',
  description: 'Premium vegetarian dining for everyday meals, family gatherings, and banquet celebrations.',
  phoneDisplay: '(555) 123-4567',
  phoneNumber: '+15551234567',
  phoneHref: 'tel:+15551234567',
  whatsappNumber: '15551234567',
  whatsappHref: 'https://wa.me/15551234567',
  email: 'info@sonaeeveg.com',
  emailHref: 'mailto:info@sonaeeveg.com',
  contactInquiryRecipient: 'tejaspangare1004@gmail.com',
  banquetInquiryRecipient: 'tejaspangare1004@gmail.com',
  address: '123 Grand Avenue, Downtown, NY 10001',
  mapEmbedUrl: 'https://www.google.com/maps?q=123%20Grand%20Avenue%20Downtown%20NY%2010001&z=14&output=embed',
  mapLink: 'https://maps.google.com/?q=123%20Grand%20Avenue%20Downtown%20NY%2010001',
  businessHours: 'Mon - Sun: 11:00 AM - 10:00 PM',
  takeawayHours: 'Mon - Sun: 11:00 AM - 9:30 PM',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  xUrl: '',
  youtubeUrl: '',
  copyrightText: 'Crafted for memorable dining, smooth ordering, and warm hospitality.',
}

function parseMetadata(metadataJson?: string) {
  if (!metadataJson) {
    return {}
  }

  try {
    return JSON.parse(metadataJson) as SiteSettingsMetadata
  } catch {
    return {}
  }
}

function buildTelHref(phoneNumber: string) {
  return `tel:${phoneNumber || defaultSiteSettings.phoneNumber}`
}

function buildMailHref(email: string) {
  return `mailto:${email || defaultSiteSettings.email}`
}

function buildWhatsAppHref(whatsappNumber: string) {
  return `https://wa.me/${whatsappNumber || defaultSiteSettings.whatsappNumber}`
}

export function getSiteSettingsFromSection(section?: ContentSection | null): SiteSettings {
  const metadata = parseMetadata(section?.metadata_json)
  const hotelName = section?.title || defaultSiteSettings.hotelName
  const shortName = metadata.shortName || section?.subtitle || defaultSiteSettings.shortName
  const brandLabel = metadata.brandLabel || defaultSiteSettings.brandLabel
  const logoText = metadata.logoText || defaultSiteSettings.logoText
  const description = section?.description || defaultSiteSettings.description
  const phoneDisplay = metadata.phoneDisplay || defaultSiteSettings.phoneDisplay
  const phoneNumber = metadata.phoneNumber || defaultSiteSettings.phoneNumber
  const whatsappNumber = metadata.whatsappNumber || defaultSiteSettings.whatsappNumber
  const email = metadata.email || defaultSiteSettings.email
  const contactInquiryRecipient = metadata.contactInquiryRecipient || defaultSiteSettings.contactInquiryRecipient
  const banquetInquiryRecipient = metadata.banquetInquiryRecipient || defaultSiteSettings.banquetInquiryRecipient

  return {
    hotelName,
    shortName,
    brandLabel,
    logoText,
    description,
    phoneDisplay,
    phoneNumber,
    phoneHref: buildTelHref(phoneNumber),
    whatsappNumber,
    whatsappHref: buildWhatsAppHref(whatsappNumber),
    email,
    emailHref: buildMailHref(email),
    contactInquiryRecipient,
    banquetInquiryRecipient,
    address: metadata.address || defaultSiteSettings.address,
    mapEmbedUrl: metadata.mapEmbedUrl || defaultSiteSettings.mapEmbedUrl,
    mapLink: metadata.mapLink || defaultSiteSettings.mapLink,
    businessHours: metadata.businessHours || defaultSiteSettings.businessHours,
    takeawayHours: metadata.takeawayHours || defaultSiteSettings.takeawayHours,
    instagramUrl: metadata.instagramUrl || defaultSiteSettings.instagramUrl,
    facebookUrl: metadata.facebookUrl || defaultSiteSettings.facebookUrl,
    xUrl: metadata.xUrl || defaultSiteSettings.xUrl,
    youtubeUrl: metadata.youtubeUrl || defaultSiteSettings.youtubeUrl,
    copyrightText: metadata.copyrightText || defaultSiteSettings.copyrightText,
  }
}

export function getSiteSettingsMetadata(settings: SiteSettings) {
  return {
    shortName: settings.shortName,
    brandLabel: settings.brandLabel,
    logoText: settings.logoText,
    phoneDisplay: settings.phoneDisplay,
    phoneNumber: settings.phoneNumber,
    whatsappNumber: settings.whatsappNumber,
    email: settings.email,
    contactInquiryRecipient: settings.contactInquiryRecipient,
    banquetInquiryRecipient: settings.banquetInquiryRecipient,
    address: settings.address,
    mapEmbedUrl: settings.mapEmbedUrl,
    mapLink: settings.mapLink,
    businessHours: settings.businessHours,
    takeawayHours: settings.takeawayHours,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
    xUrl: settings.xUrl,
    youtubeUrl: settings.youtubeUrl,
    copyrightText: settings.copyrightText,
  }
}
