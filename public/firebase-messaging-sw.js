/**
 * BattleX Firebase Messaging Service Worker
 * Handles background push notifications when the app tab is closed.
 *
 * File must be at: public/firebase-messaging-sw.js
 * (Served from root so it can intercept all push events)
 *
 * SETUP: Replace the firebaseConfig values below with your real values.
 */
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

// ─────────────────────────────────────────────────────────────────────────────
// Replace with your real Firebase config
// ─────────────────────────────────────────────────────────────────────────────
firebase.initializeApp({
  apiKey:            'AIzaSy-REPLACE-WITH-REAL-KEY',
  authDomain:        'battlex-XXXXX.firebaseapp.com',
  projectId:         'battlex-XXXXX',
  storageBucket:     'battlex-XXXXX.appspot.com',
  messagingSenderId: '000000000000',
  appId:             '1:000000000000:web:XXXXXXXXXXXXXXXX',
})

const messaging = firebase.messaging()

// ─────────────────────────────────────────────────────────────────────────────
// Handle background messages (app closed / tab not focused)
// ─────────────────────────────────────────────────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  console.log('[BattleX SW] Background message:', payload)

  const { title, body, icon, image } = payload.notification || {}
  const data = payload.data || {}

  self.registration.showNotification(title || 'BattleX', {
    body:    body    || 'You have a new notification from BattleX!',
    icon:    icon    || '/Logo-battleX_01.png',
    image:   image   || undefined,
    badge:   '/Logo-battleX_01.png',
    vibrate: [200, 100, 200],
    tag:     data.tag || 'battlex-notification',
    data:    { url: data.url || 'https://battle-x.vercel.app', ...data },
    actions: data.action ? [
      { action: 'open',    title: data.action },
      { action: 'dismiss', title: 'Dismiss' },
    ] : [],
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Handle notification click — open the app or a specific URL
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || 'https://battle-x.vercel.app'

  if (event.action === 'dismiss') return

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('battle-x.vercel.app') && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
