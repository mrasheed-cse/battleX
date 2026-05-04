/**
 * BattleX — Unified Ad Manager
 * ═══════════════════════════════════════════════════════════════════════════
 * Supports BOTH platforms from one codebase:
 *
 *   📱 Android app (Capacitor)  →  Google AdMob  (ca-app-pub-...)
 *   🌐 Web browser              →  Google AdSense (ca-pub-...)
 *
 * The correct platform is detected automatically at runtime.
 * You never need to think about which SDK to call — just call showAd().
 *
 * ─── HOW TO ACTIVATE ────────────────────────────────────────────────────────
 *
 * ANDROID (AdMob) — do these first, higher revenue:
 *   1. Go to https://admob.google.com → Add app → Android
 *   2. Package name: com.battlex.games
 *   3. Get your App ID: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
 *   4. Create ad units (Interstitial, Banner, Rewarded) for each game
 *   5. Replace all ADMOB_* values below
 *   6. Set ADMOB_ENABLED = true
 *   7. Run: npm install @capacitor-community/admob
 *   8. npx cap sync android
 *   9. Add App ID to AndroidManifest.xml (instructions below)
 *
 * WEB (AdSense):
 *   1. Apply at https://adsense.google.com (1–2 weeks approval)
 *   2. Get Publisher ID: ca-pub-XXXXXXXXXXXXXXXX
 *   3. Create ad units, get slot IDs
 *   4. Replace all ADSENSE_* values below
 *   5. Set ADSENSE_ENABLED = true
 *
 * AndroidManifest.xml — add inside <application> tag:
 *   <meta-data
 *     android:name="com.google.android.gms.ads.APPLICATION_ID"
 *     android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── MASTER SWITCHES ────────────────────────────────────────────────────────
export const ADMOB_ENABLED   = true    // Android AdMob — ENABLED
export const ADSENSE_ENABLED = false   // Web AdSense  — flip true after approval

// ─── ANDROID ADMOB CONFIG ───────────────────────────────────────────────────
// Get these from: https://admob.google.com → Apps → Ad units
export const ADMOB = {
  // App ID (goes in AndroidManifest.xml AND here for reference)
  // Format: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
  APP_ID: 'ca-app-pub-2887876230461314~4166195119',

  // Test IDs — use these during development, NEVER in production
  // Google provides permanent test IDs that always fill and don't affect metrics
  TEST_IDS: {
    banner:       'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded:     'ca-app-pub-3940256099942544/5224354917',
  },

  // Production Ad Unit IDs — replace after app is approved by AdMob
  UNITS: {
    'word-wipe': {
      banner:       'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // 320x50 bottom banner
      interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // full-screen between games
      rewarded:     'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // hint bonus
    },
    'snakes-and-ladders': {
      banner:       'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      rewarded:     'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    'parking-jam': {
      banner:       'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      rewarded:     'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    'table-tennis': {
      banner:       'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      rewarded:     'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    'ludo': {
      banner:       'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      rewarded:     'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
  },
}

// ─── WEB ADSENSE CONFIG ─────────────────────────────────────────────────────
// Get these from: https://adsense.google.com
export const ADSENSE = {
  // Publisher ID — format: ca-pub-XXXXXXXXXXXXXXXX
  PUBLISHER_ID: 'ca-pub-XXXXXXXXXXXXXXXX',

  UNITS: {
    'word-wipe': {
      banner:       'XXXXXXXXXX',
      interstitial: 'XXXXXXXXXX',
      rewarded:     'XXXXXXXXXX',
    },
    'snakes-and-ladders': {
      banner:       'XXXXXXXXXX',
      interstitial: 'XXXXXXXXXX',
      rewarded:     'XXXXXXXXXX',
    },
    'parking-jam': {
      banner:       'XXXXXXXXXX',
      interstitial: 'XXXXXXXXXX',
      rewarded:     'XXXXXXXXXX',
    },
    'table-tennis': {
      banner:       'XXXXXXXXXX',  // replace after AdSense approval
      interstitial: 'XXXXXXXXXX',  // replace after AdSense approval
      rewarded:     'XXXXXXXXXX',  // replace after AdSense approval
    },
  },
}

// ─── AD BEHAVIOUR RULES ─────────────────────────────────────────────────────
export const RULES = {
  minInterstitialGapMs:  3 * 60 * 1000,  // 3 min between interstitials
  skipSeconds:           5,               // countdown before skip button
  maxRewardedPerSession: 3,               // cap rewarded ads per session
  useTestAds:            true,            // ← set false before Play Store release
}

// ─── PLATFORM DETECTION ─────────────────────────────────────────────────────
// Returns true when running inside the Capacitor Android app
export function isNativeApp() {
  return !!(
    window.Capacitor?.isNativePlatform?.() ||
    window.Capacitor?.platform === 'android' ||
    window.Capacitor?.platform === 'ios'
  )
}

// Returns 'admob' | 'adsense' | 'none'
export function getAdPlatform() {
  if (isNativeApp() && ADMOB_ENABLED)   return 'admob'
  if (!isNativeApp() && ADSENSE_ENABLED) return 'adsense'
  return 'none'
}

// ─── ADSENSE HELPERS (web only) ──────────────────────────────────────────────
let adSenseLoaded = false

export function loadAdSenseScript() {
  if (!ADSENSE_ENABLED || isNativeApp() || adSenseLoaded) return
  if (document.querySelector('script[data-battlex-ads]')) return
  const s = document.createElement('script')
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`
  s.async = true
  s.crossOrigin = 'anonymous'
  s.setAttribute('data-battlex-ads', '1')
  document.head.appendChild(s)
  adSenseLoaded = true
}

export function pushAdSenseSlot() {
  if (!ADSENSE_ENABLED || isNativeApp()) return
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch (e) {}
}

// ─── ADMOB HELPERS (Android only) ───────────────────────────────────────────
// These dynamically import the Capacitor AdMob plugin.
// The plugin is only available inside the Android app — safe to import lazily.

async function getAdMob() {
  try {
    const { AdMob } = await import('@capacitor-community/admob')
    return AdMob
  } catch {
    console.warn('[BattleX] @capacitor-community/admob not installed')
    return null
  }
}

// Initialise AdMob — call once on app startup from App.jsx
export async function initAdMob() {
  if (!ADMOB_ENABLED || !isNativeApp()) return
  const AdMob = await getAdMob()
  if (!AdMob) return
  await AdMob.initialize({
    requestTrackingAuthorization: true,   // iOS ATT prompt
    testingDevices:               [],     // add device IDs for test mode
    initializeForTesting:         RULES.useTestAds,
  })
  console.log('[BattleX] AdMob initialised')
}

// ─── BANNER AD ───────────────────────────────────────────────────────────────
// Android: shows native bottom banner via AdMob plugin
// Web: returns config for React <ins> element rendering

export async function showBanner(gameSlug) {
  if (!isNativeApp()) return  // web banner handled via JSX in GamePlay.jsx

  const AdMob = await getAdMob()
  if (!AdMob) return

  const adId = RULES.useTestAds
    ? ADMOB.TEST_IDS.banner
    : ADMOB.UNITS[gameSlug]?.banner || ADMOB.TEST_IDS.banner

  const { BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob')

  await AdMob.showBanner({
    adId,
    adSize:   BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin:   0,
    isTesting: RULES.useTestAds,
  })
}

export async function hideBanner() {
  if (!isNativeApp()) return
  const AdMob = await getAdMob()
  if (!AdMob) return
  try { await AdMob.removeBanner() } catch {}
}

// ─── INTERSTITIAL AD ─────────────────────────────────────────────────────────
// Android: loads + shows native full-screen via AdMob
// Web: sets state in GamePlay.jsx to show overlay
// Returns: Promise<boolean> — true if ad was shown

export async function showInterstitial(gameSlug) {
  if (!isNativeApp()) {
    // Web: signal to GamePlay.jsx to show its overlay
    // GamePlay.jsx handles this via BATTLEX_SHOW_AD postMessage from iframe
    return false
  }

  if (!ADMOB_ENABLED) return false

  const AdMob = await getAdMob()
  if (!AdMob) return false

  const adId = RULES.useTestAds
    ? ADMOB.TEST_IDS.interstitial
    : ADMOB.UNITS[gameSlug]?.interstitial || ADMOB.TEST_IDS.interstitial

  try {
    await AdMob.prepareInterstitial({ adId, isTesting: RULES.useTestAds })
    await AdMob.showInterstitial()
    return true
  } catch (err) {
    console.warn('[BattleX] Interstitial failed:', err)
    return false
  }
}

// ─── REWARDED AD ─────────────────────────────────────────────────────────────
// Returns Promise<boolean> — true = user watched and earned reward
// false = ad failed or user dismissed early

export async function showRewarded(gameSlug) {
  if (!isNativeApp() || !ADMOB_ENABLED) return false

  const AdMob = await getAdMob()
  if (!AdMob) return false

  const adId = RULES.useTestAds
    ? ADMOB.TEST_IDS.rewarded
    : ADMOB.UNITS[gameSlug]?.rewarded || ADMOB.TEST_IDS.rewarded

  try {
    await AdMob.prepareRewardVideoAd({ adId, isTesting: RULES.useTestAds })
    const result = await AdMob.showRewardVideoAd()
    // result.value contains reward info if earned
    return !!(result?.value)
  } catch (err) {
    console.warn('[BattleX] Rewarded ad failed:', err)
    return false
  }
}

// ─── CONVENIENCE EXPORT for GamePlay.jsx ─────────────────────────────────────
export const adManager = {
  isNativeApp,
  getAdPlatform,
  initAdMob,
  showBanner,
  hideBanner,
  showInterstitial,
  showRewarded,
  loadAdSenseScript,
  pushAdSenseSlot,
  ADMOB,
  ADSENSE,
  RULES,
}

export default adManager
