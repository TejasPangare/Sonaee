import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCieT-BPG7crePUtFkGX7Ts55NzXPPBCRM",
  authDomain: "sonaee.firebaseapp.com",
  projectId: "sonaee",
  storageBucket: "sonaee.firebasestorage.app",
  messagingSenderId: "193660205460",
  appId: "1:193660205460:web:909fc20898b5d7b5acf781"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
