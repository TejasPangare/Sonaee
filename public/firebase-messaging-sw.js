importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCieT-BPG7crePUtFkGX7Ts55NzXPPBCRM",
  authDomain: "sonaee.firebaseapp.com",
  projectId: "sonaee",
  storageBucket: "sonaee.firebasestorage.app",
  messagingSenderId: "193660205460",
  appId: "1:193660205460:web:909fc20898b5d7b5acf781"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body
    }
  );
});