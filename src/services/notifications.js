/**
 * BattleX — Firebase Push Notification Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles push notification permission, token registration, and
 * foreground message display for the BattleX web app.
 *
 * SETUP STEPS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create project named "battlex"
 * 3. Add a Web App → get your firebaseConfig object
 * 4. Go to Project Settings → Cloud Messaging → Web Push Certificates
 * 5. Generate a VAPID key pair → copy the public key
 * 6. Replace all placeholder values below with your real values
 * 7. Create public/firebase-messaging-sw.js (service worker — see below)
 *
 * HOW IT WORKS:
 *   User visits BattleX → prompted to allow notifications
 *   FCM token saved → your backend can send targeted pushes
 *   When app is open → foreground messages shown as toast
 *   When app is closed → browser shows native OS notification
 */

// ─────────────────────────────────────────────────────────────────────────────
// REPLACE THESE with your real Firebase config values
// Firebase Console → Project Settings → General → Your apps → Config
// ─────────────────────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            'AIzaSy-REPLACE-WITH-REAL-KEY',
  authDomain:        'battlex-XXXXX.firebaseapp.com',
  projectId:         'battlex-XXXXX',
  storageBucket:     'battlex-XXXXX.appspot.com',
  messagingSenderId: '000000000000',
  appId:             '1:000000000000:web:XXXXXXXXXXXXXXXX',
}

// VAPID public key from Firebase Console → Cloud Messaging → Web Push Certificates
const VAPID_KEY = 'REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY'

// Set to true once Firebase is configured
const FIREBASE_ENABLED = false

// ─────────────────────────────────────────────────────────────────────────────
let messaging = null

// Initialise Firebase and get Messaging instance
async function initFirebase() {
  if (!FIREBASE_ENABLED) return null
  if (messaging) return messaging

  try {
    const { initializeApp }   = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js')
    const { getMessaging, getToken, onMessage }
      = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js')

    const app = initializeApp(FIREBASE_CONFIG)
    messaging = getMessaging(app)
    return { messaging, getToken, onMessage }
  } catch (err) {
    console.warn('[BattleX] Firebase init failed:', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Request permission and register FCM token
// Call this after user interaction (e.g. clicking "Enable Notifications")
// ─────────────────────────────────────────────────────────────────────────────
export async function requestNotificationPermission() {
  if (!FIREBASE_ENABLED) return null

  // Check browser support
  if (!('Notification' in window)) {
    console.warn('[BattleX] Notifications not supported in this browser')
    return null
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[BattleX] Service Worker not supported')
    return null
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('[BattleX] Notification permission denied')
      return null
    }

    const firebase = await initFirebase()
    if (!firebase) return null

    const { getToken } = firebase

    // Register service worker
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }
    )

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey:            VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    if (token) {
      console.log('[BattleX] FCM Token:', token)
      // Save token to your backend/Supabase for targeting
      await saveFCMToken(token)
      return token
    }
  } catch (err) {
    console.warn('[BattleX] Failed to get FCM token:', err)
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Save FCM token to Supabase so you can send targeted notifications
// ─────────────────────────────────────────────────────────────────────────────
async function saveFCMToken(token) {
  try {
    await fetch('/api/fcm-token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, timestamp: new Date().toISOString() }),
    })
  } catch (e) {
    // Non-critical — token is logged above for manual use
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Listen for foreground messages (when app tab is open)
// onNotification: function({ title, body, icon, data }) — shows a toast
// ─────────────────────────────────────────────────────────────────────────────
export async function onForegroundMessage(onNotification) {
  if (!FIREBASE_ENABLED) return

  const firebase = await initFirebase()
  if (!firebase) return

  const { onMessage } = firebase

  onMessage(messaging, (payload) => {
    console.log('[BattleX] Foreground message:', payload)
    const { title, body, icon } = payload.notification || {}
    if (onNotification) {
      onNotification({ title, body, icon, data: payload.data })
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Check current permission status
// Returns: 'granted' | 'denied' | 'default' | 'unsupported'
// ─────────────────────────────────────────────────────────────────────────────
export function getNotificationStatus() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export { FIREBASE_ENABLED }
