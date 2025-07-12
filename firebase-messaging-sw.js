importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyC7f9y43FTWklNNYVE5TrEKoqlSMt3Nv8U",
    authDomain: "simulatedminingapp.firebaseapp.com",
    projectId: "simulatedminingapp",
    storageBucket: "simulatedminingapp.appspot.com",
    messagingSenderId: "1075873844477",
    appId: "1:1075873844477:web:4b16da1ccb420ccb25c294"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icon.png", // Your app icon
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});