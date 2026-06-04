import { getApp, getApps, initializeApp } from "firebase/app";

// Read Firebase config from environment to avoid hardcoding credentials.
// Expected format: NEXT_PUBLIC_FIREBASE_CONFIG as a JSON string.
let firebaseConfig: Record<string, string> = {};
if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
  try {
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string) as Record<string, string>;
  } catch (err) {
    // If parsing fails, leave firebaseConfig empty and warn at runtime.
    // The app will still attempt to initialize (with possibly empty values),
    // but developers should provide a valid `NEXT_PUBLIC_FIREBASE_CONFIG`.
    // eslint-disable-next-line no-console
    console.warn("Invalid NEXT_PUBLIC_FIREBASE_CONFIG JSON. Set it in your .env.local file.");
  }
}

const requiredFirebaseKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const hasValidFirebaseConfig = requiredFirebaseKeys.every((key) => firebaseConfig[key]);

export const app = hasValidFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig as any))
  : null;
