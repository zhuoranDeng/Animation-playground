import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ensureSeedExample } from './data/store'
import './index.css'

if (typeof window !== 'undefined') window.React = React

function showError(msg) {
  const root = document.getElementById('root')
  if (!root) return
  const div = document.createElement('div')
  div.style.cssText = 'padding:24px;font-family:system-ui;max-width:600px;'
  const h2 = document.createElement('h2')
  h2.style.color = '#c00'
  h2.textContent = 'Failed to load'
  const pre = document.createElement('pre')
  pre.style.cssText = 'background:#f5f5f5;padding:12px;overflow:auto;font-size:12px;'
  pre.textContent = msg
  div.append(h2, pre)
  root.innerHTML = ''
  root.appendChild(div)
}

function init() {

  try {
    ensureSeedExample()
  } catch (e) {
    console.error('ensureSeedExample:', e)
  }

  class ErrorBoundary extends React.Component {
    state = { error: null }
    static getDerivedStateFromError(error) {
      return { error }
    }
    render() {
      if (this.state.error) {
        return (
          <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 600 }}>
            <h2 style={{ color: '#c00' }}>Something went wrong</h2>
            <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto', fontSize: 12 }}>
              {this.state.error?.message ?? String(this.state.error)}
            </pre>
          </div>
        )
      }
      return this.props.children
    }
  }

  const rootEl = document.getElementById('root')
  if (!rootEl) {
    showError('Root element #root not found.')
    return
  }
  createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
}

try {
  init()
} catch (e) {
  showError(e?.message ?? e?.stack ?? String(e))
}
