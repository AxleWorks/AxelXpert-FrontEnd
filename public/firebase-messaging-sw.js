importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');


firebase.initializeApp({
   apiKey: "AIzaSyBAw4lOrdFbGQ_fVb1Vtl1MIpxP5-sEXho",
  authDomain: "notifications-b8dce.firebaseapp.com",
  projectId: "notifications-b8dce",
  storageBucket: "notifications-b8dce.firebasestorage.app",
  messagingSenderId: "887815135353",
  appId: "1:887815135353:web:ab50da4617ee210b82f4a8"
});

const messaging = firebase.messaging();

// handle background messages
messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  let urlToOpen = 'http://localhost:5173/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus on it and navigate
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus().then(() => {
            // Navigate to the URL if client supports it
            if (client.url && 'navigate' in client) {
              return client.navigate(urlToOpen);
            }
          });
        }
      }
      // if app is not open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
