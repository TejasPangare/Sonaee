"use client"

import { useEffect } from "react"
import { onMessage } from "firebase/messaging"
import { initFirebaseMessaging } from "@/lib/getPushToken"

export default function FirebaseMessagingClient() {
  useEffect(() => {
    const initMessaging = async () => {
      const result = await initFirebaseMessaging()
      if (!result) return

      const { messaging } = result
      onMessage(messaging, (payload) => {
        console.log("Foreground message:", payload)
      })
    }

    initMessaging()
  }, [])

  return null
}
