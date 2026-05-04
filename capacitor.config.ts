import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  // ── App identity ──────────────────────────────────────────────────────────
  appId:   'com.battlex.games',
  appName: 'BattleX',

  // ── Web build output folder ───────────────────────────────────────────────
  webDir: 'dist',

  // ── Android specific ──────────────────────────────────────────────────────
  android: {
    // Allow games to run in WebView without restrictions
    allowMixedContent:      true,
    // Prevent status bar overlapping game content
    captureInput:           true,
    // WebView performance settings
    webContentsDebuggingEnabled: false,  // set true during development
    backgroundColor: '#080810',
  },

  // ── Server config for live reload during dev ──────────────────────────────
  // Comment out for production builds
  // server: {
  //   url: 'http://YOUR_LOCAL_IP:3000',
  //   cleartext: true,
  // },

  // ── Plugin configuration ──────────────────────────────────────────────────
  plugins: {

    // AdMob — configure in adManager.js, App ID goes in AndroidManifest.xml
    AdMob: {
      // Optional: initialise config here if not using the JS API
    },

    // Status bar — hide for full-screen game experience
    StatusBar: {
      style:           'Dark',
      backgroundColor: '#080810',
      overlaysWebView: false,
    },

    // Splash screen
    SplashScreen: {
      launchShowDuration:      2000,
      launchAutoHide:          true,
      backgroundColor:         '#080810',
      androidSplashResourceName: 'splash',
      showSpinner:             false,
    },
  },
}

export default config
