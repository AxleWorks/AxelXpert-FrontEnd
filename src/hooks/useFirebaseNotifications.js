import { useEffect, useState, useCallback } from 'react';
import { messaging, getToken, onMessage } from '../config/firebaseConfig';
import notificationService from '../services/notificationService';

const useFirebaseNotifications = (user) => {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveTokenToBackend = useCallback(async (fcmToken) => {
    try {
      await notificationService.registerToken(fcmToken, 'web');
    } catch (error) {
      console.error('Error saving FCM token to backend:', error);
      setError('Failed to save notification token');
    }
  }, []);

  const requestPermission = useCallback(async () => {

   // check browser object for notifications
    if (!('Notification' in window)) {
      setError('Notifications not supported in this browser');
      return;
    }

    // check browser object for service worker
    if (!('serviceWorker' in navigator)) {
      setError('Service Worker not supported');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {

        // Register service worker
        const registration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Get FCM token
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
          setToken(currentToken);
          await saveTokenToBackend(currentToken);
        } else {
          setError('Failed to get notification token');
        }
      } else {
        setError('Notification permission denied. Please enable notifications in browser settings.');
      } 
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setError('Error setting up notifications: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [saveTokenToBackend]);

  useEffect(() => {
    // Only initialize if user is logged in
    if (!user) {
      console.log('Waiting for user login before initializing notifications');
      return;
    }

    requestPermission();
    
  }, [user, requestPermission]);

  // Listen for foreground messages 
  useEffect(() => {
    if (!messaging) {
      console.log('⏸️ Messaging not available for foreground listener');
      return;
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      // Update state to trigger UI update
      setNotification({
        id: payload.data?.notificationId || Date.now(),
        title: payload.notification?.title,
        body: payload.notification?.body || '',
        data: payload.data || {},
        type: payload.data?.type,
        timestamp: new Date().toISOString(),
        isRead: false,
      });

      // Show browser notification even when app is in foreground
      if (Notification.permission === 'granted') {
        const browserNotification = new Notification(
          payload.notification?.title || 'New Notification',
          {
            body: payload.notification?.body,
            requireInteraction: false,
            data: payload.data,
          }
        );

        browserNotification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          
          // Navigate based on notification type
          const actionUrl = payload.data?.actionUrl;
          if (actionUrl) {
            window.location.href = actionUrl;
          }
        };
      }

    });

    return () => {
      console.log('Cleaning up foreground message listener');
      unsubscribe();
    };
  }, [user]);

  // Clear current notification
  const clearNotification = useCallback(() => {
    console.log('Clearing current notification');
    setNotification(null);
  }, []);

  return { 
    token, 
    notification, 
    isLoading, 
    error,
    clearNotification 
  };
};

export default useFirebaseNotifications;
