"use client"

import { useEffect } from "react"
import { onMessage } from "firebase/messaging"
import { getPushToken, initFirebaseMessaging } from "@/lib/getPushToken"

export default function FirebaseMessagingClient() {
  useEffect(() => {
    const initMessaging = async () => {
      console.log("[FCM] FCM initialization started")
      
      // Step 1: Get FCM token
      const token = await getPushToken()
      if (token) {
        console.log("[FCM] Token generated")
      }
      
      // Step 2: Initialize Firebase messaging and register foreground listener
      const result = await initFirebaseMessaging()
      if (!result) return

      const { messaging } = result
      onMessage(messaging, (payload) => {
        console.log("Foreground message:", payload)
      })
      console.log("[FCM] Foreground listener registered")
    }

    initMessaging()
  }, [])

  return null
}
