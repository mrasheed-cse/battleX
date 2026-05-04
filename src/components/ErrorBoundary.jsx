import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('BattleX Error Boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px 20px', textAlign: 'center',
          fontFamily: 'Inter, sans-serif', background: '#080810', color: '#f1f5f9',
        }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>💥</div>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 36, fontWeight: 900, marginBottom: 12 }}>
            Something Went Wrong
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 32, maxWidth: 400, lineHeight: 1.7 }}>
            An unexpected error occurred. Our team has been notified.
            Try refreshing the page.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#a855f7', color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: 8, fontWeight: 700,
                fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
              style={{
                background: 'transparent', color: '#a855f7',
                border: '1.5px solid #a855f7', padding: '12px 28px',
                borderRadius: 8, fontWeight: 700, fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: 32, textAlign: 'left', maxWidth: 600 }}>
              <summary style={{ color: '#ef4444', cursor: 'pointer', marginBottom: 8 }}>
                Error Details (dev only)
              </summary>
              <pre style={{
                background: '#0d0d14', border: '1px solid #1e1e35',
                borderRadius: 8, padding: 16, fontSize: 12,
                color: '#f97316', overflow: 'auto', maxHeight: 200,
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
