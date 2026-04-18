import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import { AuthProvider }  from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useScrollToTop } from './hooks/useScrollToTop'
import { useModal }        from './hooks/useModal'
import { BackToTop, MobileBottomNav } from './components/UIExtras'
import AppLoader    from './components/AppLoader'

import Navbar       from './components/Navbar'
import Footer       from './components/Footer'
import AuthModal    from './components/AuthModal'
import CookieBanner from './components/CookieBanner'

import Home        from './pages/Home'
import Games       from './pages/Games'
import GameDetail  from './pages/GameDetail'
import GamePlay    from './pages/GamePlay'
import Tournaments from './pages/Tournaments'
import Leaderboard from './pages/Leaderboard'
import Pricing     from './pages/Pricing'
import Dashboard   from './pages/Dashboard'
import About       from './pages/About'
import News        from './pages/News'
import Contact     from './pages/Contact'
import Careers     from './pages/Careers'
import Privacy     from './pages/Privacy'
import Terms       from './pages/Terms'
import NotFound    from './pages/NotFound'
import SnakesLeaderboard      from './pages/SnakesLeaderboard'
import ParkingJamLeaderboard   from './pages/ParkingJamLeaderboard'
import TableTennisLeaderboard from './pages/TableTennisLeaderboard'
import { loadAdSenseScript, initAdMob, isNativeApp } from './services/adManager'

function Layout({ children, onLoginClick, onSignupClick }) {
  useScrollToTop()

  // Initialise ads on app start — AdMob for Android, AdSense for web
  useEffect(() => {
    if (isNativeApp()) {
      initAdMob()
    } else {
      loadAdSenseScript()
    }
  }, [])

  // Fix viewport height on mobile (Android WebView dvh workaround)
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        '--app-height', `${window.innerHeight}px`
      )
    }
    setAppHeight()
    window.addEventListener('resize', setAppHeight)
    return () => window.removeEventListener('resize', setAppHeight)
  }, [])
  const { pathname } = useLocation()
  const isPlayPage = pathname.endsWith('/play')

  return (
    <>
      {!isPlayPage && <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />}
      <main>{children}</main>
      {!isPlayPage && <Footer />}
      <CookieBanner />
      {!isPlayPage && <BackToTop />}
      {!isPlayPage && <MobileBottomNav />}
    </>
  )
}

function LudoRedirect() {
  window.location.replace('/games/ludo/index.html')
  return null
}

export default function App() {
  const [appReady, setAppReady] = useState(false)
  const loginModal = useModal(false)
  const [authTab, setAuthTab] = useState('login')

  const openLogin  = useCallback(() => { setAuthTab('login');  loginModal.open() }, [loginModal])
  const openSignup = useCallback(() => { setAuthTab('signup'); loginModal.open() }, [loginModal])
  const handleLoaderDone = useCallback(() => setAppReady(true), [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>

            {/* Splash screen on first load */}
            {!appReady && <AppLoader onDone={handleLoaderDone} />}

            {/* Main app — rendered behind splash, becomes visible after */}
            <div style={{ visibility: appReady ? 'visible' : 'hidden' }}>
              <Routes>
                {/* GamePlay rendered WITHOUT navbar/footer for full-screen game experience */}
                <Route path="/games/:slug/play" element={<GamePlay />} />

                <Route path="/*" element={
                  <Layout onLoginClick={openLogin} onSignupClick={openSignup}>
                    <Routes>
                      <Route path="/"                  element={<Home        onSignup={openSignup} />} />
                      <Route path="/games"             element={<Games />} />
                      <Route path="/games/:slug/info"  element={<GameDetail />} />
                      <Route path="/games/:slug"       element={<GameDetail />} />
                      <Route path="/tournaments"       element={<Tournaments />} />
                      <Route path="/leaderboard"       element={<Leaderboard />} />
                      <Route path="/pricing"           element={<Pricing onSignup={openSignup} />} />
                      <Route path="/dashboard"         element={<Dashboard />} />
                      <Route path="/about"             element={<About />} />
                      <Route path="/news"              element={<News />} />
                      <Route path="/contact"           element={<Contact />} />
                      <Route path="/careers"           element={<Careers />} />
                      <Route path="/privacy"           element={<Privacy />} />
                      <Route path="/terms"             element={<Terms />} />
                      <Route path="/games/ludo/play" element={<LudoRedirect />} />
                      <Route path="/games/snakes-and-ladders/leaderboard" element={<SnakesLeaderboard />} />
                      <Route path="/games/parking-jam/leaderboard"   element={<ParkingJamLeaderboard />} />
                      <Route path="/games/table-tennis/leaderboard" element={<TableTennisLeaderboard />} />
                      <Route path="*"                  element={<NotFound />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>

              {loginModal.isOpen && (
                <AuthModal defaultTab={authTab} onClose={loginModal.close} />
              )}
            </div>

          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
