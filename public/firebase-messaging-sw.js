importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCE8C2etJrBoTq6vHntqAQhHIXW6lEo0DE",
  authDomain: "sonaee-veg.firebaseapp.com",
  projectId: "sonaee-veg",
  storageBucket: "sonaee-veg.firebasestorage.app",
  messagingSenderId: "139778729097",
  appId: "1:139778729097:web:658dd8223c9ef4e32a9258"
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