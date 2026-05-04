/**
 * BattleX — Notification Bell Component
 * Shows in the navbar. Requests push permission on click.
 * Displays foreground toasts when app is open.
 */
import { useState, useEffect, useCallback } from 'react'
import {
  requestNotificationPermission,
  onForegroundMessage,
  getNotificationStatus,
  FIREBASE_ENABLED,
} from '../services/notifications'
import styles from './NotificationBell.module.css'

export default function NotificationBell() {
  const [status,   setStatus]   = useState('default')   // 'default'|'granted'|'denied'|'unsupported'
  const [toast,    setToast]    = useState(null)         // { title, body }
  const [loading,  setLoading]  = useState(false)

  // Check current permission on mount
  useEffect(() => {
    setStatus(getNotificationStatus())
  }, [])

  // Listen for foreground messages
  useEffect(() => {
    if (!FIREBASE_ENABLED) return
    onForegroundMessage(({ title, body }) => {
      setToast({ title, body })
      setTimeout(() => setToast(null), 6000)
    })
  }, [])

  const handleClick = useCallback(async () => {
    if (status === 'denied' || status === 'unsupported') return
    if (status === 'granted') return   // already enabled

    setLoading(true)
    try {
      const token = await requestNotificationPermission()
      setStatus(token ? 'granted' : 'denied')
    } catch {
      setStatus('denied')
    } finally {
      setLoading(false)
    }
  }, [status])

  // Don't render if Firebase not configured yet
  if (!FIREBASE_ENABLED) return null

  const icons = {
    default:     '🔔',
    granted:     '🔔',
    denied:      '🔕',
    unsupported: '🔕',
  }

  const titles = {
    default:     'Enable game notifications',
    granted:     'Notifications enabled',
    denied:      'Notifications blocked — enable in browser settings',
    unsupported: 'Notifications not supported in this browser',
  }

  return (
    <>
      <button
        className={`${styles.bell} ${status === 'granted' ? styles.active : ''}`}
        onClick={handleClick}
        title={titles[status]}
        disabled={loading || status === 'denied' || status === 'unsupported'}
        aria-label={titles[status]}
      >
        {loading ? <span className={styles.spinner} /> : icons[status]}
      </button>

      {/* Foreground notification toast */}
      {toast && (
        <div className={styles.toast}>
          <div className={styles.toastIcon}>🎮</div>
          <div className={styles.toastContent}>
            <div className={styles.toastTitle}>{toast.title}</div>
            <div className={styles.toastBody}>{toast.body}</div>
          </div>
          <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}
    </>
  )
}
