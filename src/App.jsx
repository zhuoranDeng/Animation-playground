import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useSearchParams } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { ConfigProvider } from 'antd'
import { Globe, Type, Layers, MousePointer2 } from 'lucide-react'
import { DEFAULT_CATEGORIES } from './constants/categories'
import { Dock, DockIcon } from './components/ui/dock'
import ListPage from './pages/ListPage'
import ExampleDetailPage from './pages/ExampleDetailPage'
import ExampleForm from './pages/ExampleForm'
import './App.css'

const NAV_ORDER_KEY = 'animation-playground-nav-order-v3'

const CATEGORY_ICONS = {
  all: Globe,
  'Text effect': Type,
  'Background effect': Layers,
  'Button interactions': MousePointer2,
}

function loadCategoryOrder() {
  try {
    const raw = localStorage.getItem(NAV_ORDER_KEY)
    if (!raw) return [...DEFAULT_CATEGORIES]
    const order = JSON.parse(raw)
    if (!Array.isArray(order) || order.length !== DEFAULT_CATEGORIES.length) return [...DEFAULT_CATEGORIES]
    if (!DEFAULT_CATEGORIES.every((c) => order.includes(c))) return [...DEFAULT_CATEGORIES]
    // If stored order doesn’t match default (e.g. after we change default order), use default
    if (order[0] !== DEFAULT_CATEGORIES[0]) return [...DEFAULT_CATEGORIES]
    return order
  } catch {
    return [...DEFAULT_CATEGORIES]
  }
}

const theme = {
  token: {
    borderRadiusLG: 16,
  },
}

function AppLayout() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [categoryOrder, setCategoryOrder] = useState(loadCategoryOrder)

  const current =
    categoryFromUrl && DEFAULT_CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : 'all'

  useEffect(() => {
    localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(categoryOrder))
  }, [categoryOrder])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== NAV_ORDER_KEY || e.newValue == null) return
      try {
        const order = JSON.parse(e.newValue)
        if (!Array.isArray(order) || order.length !== DEFAULT_CATEGORIES.length) return
        if (!DEFAULT_CATEGORIES.every((c) => order.includes(c))) return
        if (order[0] !== DEFAULT_CATEGORIES[0]) return
        setCategoryOrder(order)
      } catch (_) {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <div className="app-layout">
      <header className="app-header">
        <span className="app-header-title">Charlotte's animation playground</span>
      </header>
      <div className="app-body">
        <main className="app-main">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/example/:id" element={<ExampleDetailPage />} />
              <Route path="/example/:id/edit" element={<ExampleForm />} />
              <Route path="/add" element={<ExampleForm />} />
            </Routes>
          </div>
        </main>
      </div>
      <div className="app-dock-wrap">
        <Dock className="app-dock" iconSize={44} iconMagnification={64} disableMagnification={false}>
          {categoryOrder.map((value) => {
            const Icon = CATEGORY_ICONS[value]
            const isActive = current === value
            const label = value === 'all' ? 'Online Inspirations' : value
            return (
              <DockIcon key={value} className={`app-dock-icon-with-label${isActive ? ' app-dock-icon--active' : ''}`}>
                <div className="app-dock-icon-inner">
                  <span className="app-dock-label">{label}</span>
                  <Link
                    to={value === 'all' ? '/' : `/?category=${encodeURIComponent(value)}`}
                    title={label}
                    aria-label={label}
                    className="app-dock-link"
                  >
                    {Icon && <Icon size={26} strokeWidth={1.75} className="app-dock-icon-svg" />}
                  </Link>
                </div>
              </DockIcon>
            )
          })}
        </Dock>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  )
}
