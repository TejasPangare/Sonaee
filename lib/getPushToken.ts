import { getMessaging, getToken, isSupported } from "firebase/messaging"

import { app } from "./firebase"

const SERVICE_WORKER_URL = "/firebase-messaging-sw.js"
const STORAGE_KEY = "fcm_push_token"

const registerFirebaseMessagingServiceWorker = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null

  const existingRegistration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL)
  if (existingRegistration) return existingRegistration

  return navigator.serviceWorker.register(SERVICE_WORKER_URL)
}

export const initFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null

  const supported = await isSupported()
  if (!supported) {
    console.log("Firebase messaging not supported in this browser")
    return null
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  if (!vapidKey) {
    console.warn("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY for Firebase messaging")
    return null
  }

  if (!app) {
    console.warn("Missing or invalid NEXT_PUBLIC_FIREBASE_CONFIG for Firebase messaging")
    return null
  }

  const registration = await registerFirebaseMessagingServiceWorker()
  if (!registration) {
    console.warn("Failed to register Firebase messaging service worker")
    return null
  }

  const messaging = getMessaging(app)
  return { messaging, registration, vapidKey }
}

export const getPushToken = async () => {
  if (typeof window === "undefined") {
    console.warn("[FCM] getPushToken called in non-browser environment")
    return null
  }

  const cachedToken = localStorage.getItem(STORAGE_KEY)
  if (cachedToken) {
    console.log(`[FCM] Using cached token: ${cachedToken.substring(0, 30)}...`)
    return cachedToken
  }

  const result = await initFirebaseMessaging()
  if (!result) {
    console.warn("[FCM] Firebase messaging initialization failed")
    return null
  }

  const { messaging, registration, vapidKey } = result
  console.log("[FCM] Firebase messaging initialized")

  const permission = await Notification.requestPermission()
  console.log(`[FCM] Notification permission: ${permission}`)
  if (permission !== "granted") {
    console.warn("[FCM] Notification permission denied by user")
    return null
  }

  try {
    console.log("[FCM] Requesting FCM token...")
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })

    if (token) {
      console.log(`[FCM] Token received: ${token.substring(0, 30)}...`)
      localStorage.setItem(STORAGE_KEY, token)
      return token
    }

    console.warn("[FCM] getToken returned empty token")
    return null
  } catch (error) {
    console.error("[FCM] Failed to get push token:", error)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}
