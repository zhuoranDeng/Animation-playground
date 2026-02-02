import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, Typography, Space, Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { getExamples, ensureSeedExample } from '../data/store'
import { DEFAULT_CATEGORIES, DEFAULT_CATEGORY, ONLINE_INSPIRATION_TITLES } from '../constants/categories'
import LivePreview from '../components/LivePreview'
import { BubbleBackground } from '../components/animate-ui/components/backgrounds/bubble'
import { GravityStarsBackground } from '../components/animate-ui/components/backgrounds/gravity-stars'
import { ThemeTogglerButton } from '../components/animate-ui/components/buttons/theme-toggler'

const PREVIEW_COMPONENTS = { BubbleBackground, GravityStarsBackground, ThemeTogglerButton }

class PreviewErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="list-card-preview-component" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy-muted)', fontSize: 12 }}>
          Preview unavailable
        </div>
      )
    }
    return this.props.children
  }
}
const { Title } = Typography
const TILE_ORDER_KEY = 'animation-playground-tile-order'

function loadTileOrder() {
  try {
    const raw = localStorage.getItem(TILE_ORDER_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveTileOrder(orders) {
  localStorage.setItem(TILE_ORDER_KEY, JSON.stringify(orders))
}

export default function ListPage() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const categoryFilter = categoryFromUrl && DEFAULT_CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : DEFAULT_CATEGORY
  const categorySubtitle =
    categoryFilter === 'all' ? 'Online Inspirations' : categoryFilter
  const [examples, setExamples] = useState(() => getExamples())
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null)
  const [tileOrder, setTileOrder] = useState(loadTileOrder)
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [ghostPosition, setGhostPosition] = useState(null)
  const [ghostSize, setGhostSize] = useState(null)
  const dragStateRef = useRef(null)
  const didDragRef = useRef(false)
  const gridRef = useRef(null)

  useEffect(() => {
    ensureSeedExample()
    setExamples(getExamples())
  }, [])

  useEffect(() => {
    if (draggedId) document.body.classList.add('list-tile-dragging')
    else document.body.classList.remove('list-tile-dragging')
    return () => document.body.classList.remove('list-tile-dragging')
  }, [draggedId])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== TILE_ORDER_KEY || e.newValue == null) return
      try {
        const next = JSON.parse(e.newValue)
        if (typeof next === 'object' && next !== null) setTileOrder(next)
      } catch (_) {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') {
      return examples.filter((ex) =>
        ONLINE_INSPIRATION_TITLES.includes(ex.title?.trim() ?? '')
      )
    }
    return examples.filter((ex) => ex.category === categoryFilter)
  }, [examples, categoryFilter])

  const orderIds = tileOrder[categoryFilter]
  const orderedList = useMemo(() => {
    if (!orderIds || orderIds.length === 0) return filtered
    const idToIndex = new Map(orderIds.map((id, i) => [id, i]))
    return [...filtered].sort((a, b) => {
      const ia = idToIndex.has(a.id) ? idToIndex.get(a.id) : 1e9
      const ib = idToIndex.has(b.id) ? idToIndex.get(b.id) : 1e9
      return ia - ib
    })
  }, [filtered, orderIds])

  const saveOrderForCategory = useCallback((category, ids) => {
    setTileOrder((prev) => {
      const next = { ...prev, [category]: ids }
      saveTileOrder(next)
      return next
    })
  }, [])

  const orderRef = useRef({ orderedList: [], categoryFilter: '', saveOrderForCategory: () => {} })
  orderRef.current = { orderedList, categoryFilter, saveOrderForCategory }
  const draggingIdRef = useRef(null)
  const dragOverIdRef = useRef(null)
  const listenersRef = useRef({ move: null, up: null })

  const handlePointerDown = useCallback((e, ex) => {
    dragOverIdRef.current = null
    if (e.button !== 0) return
    const wrap = e.currentTarget
    const rect = wrap.getBoundingClientRect()
    const offset = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    dragStateRef.current = { cardId: ex.id, rect, offset, startX: e.clientX, startY: e.clientY }

    const onMove = (moveEvent) => {
      const state = dragStateRef.current
      if (!state) return
      if (!draggingIdRef.current) {
        const dist = Math.hypot(moveEvent.clientX - state.startX, moveEvent.clientY - state.startY)
        if (dist > 5) {
          draggingIdRef.current = state.cardId
          setDraggedId(state.cardId)
          setGhostPosition({ x: moveEvent.clientX - state.offset.x, y: moveEvent.clientY - state.offset.y })
          setGhostSize({ w: state.rect.width, h: state.rect.height })
        }
      } else {
        setGhostPosition({ x: moveEvent.clientX - state.offset.x, y: moveEvent.clientY - state.offset.y })
        const x = moveEvent.clientX
        const y = moveEvent.clientY
        const grid = gridRef.current
        if (grid && grid.children) {
          for (let i = 0; i < grid.children.length; i++) {
            const child = grid.children[i]
            const tid = child.getAttribute?.('data-tile-id')
            if (!tid || tid === state.cardId) continue
            const rect = child.getBoundingClientRect()
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
              dragOverIdRef.current = tid
              setDragOverId(tid)
              return
            }
          }
        }
        dragOverIdRef.current = null
        setDragOverId(null)
      }
    }

    const onUp = (upEvent) => {
      const { move, up: upListener } = listenersRef.current
      if (move) window.removeEventListener('pointermove', move)
      if (upListener) window.removeEventListener('pointerup', upListener)
      listenersRef.current = { move: null, up: null }
      dragStateRef.current = null

      const id = draggingIdRef.current
      if (id) {
        didDragRef.current = true
        const dropId = dragOverIdRef.current
        if (dropId && dropId !== id) {
          const { orderedList: list, categoryFilter: cat, saveOrderForCategory: save } = orderRef.current
          const fromIndex = list.findIndex((ex) => ex.id === id)
          const toIndex = list.findIndex((ex) => ex.id === dropId)
          if (fromIndex !== -1 && toIndex !== -1) {
            const newOrder = list.filter((_, i) => i !== fromIndex)
            newOrder.splice(toIndex, 0, list[fromIndex])
            save(cat, newOrder.map((ex) => ex.id))
          }
        }
        draggingIdRef.current = null
        dragOverIdRef.current = null
        setDraggedId(null)
        setDragOverId(null)
        setGhostPosition(null)
        setGhostSize(null)
        setTimeout(() => { didDragRef.current = false }, 0)
      }
    }

    listenersRef.current = { move: onMove, up: onUp }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [])

  const hasLivePreview = (ex) =>
    ex.embedUrl ||
    ex.previewType === 'component' ||
    (ex.previewType === 'code' && (ex.codeHtml || ex.codeCss || ex.codeJs))

  return (
    <div className="list-page">
      {filtered.length === 0 ? (
        <div style={{ marginTop: 48, color: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>
          {examples.length === 0 ? (
            <>
              <p style={{ marginBottom: 16 }}>No examples yet.</p>
              <Button type="primary" onClick={() => { ensureSeedExample(); setExamples(getExamples()) }}>
                Load demo example
              </Button>
            </>
          ) : (
            'No examples in this category.'
          )}
        </div>
      ) : (
        <>
          <p className="list-page-subtitle">{categorySubtitle}</p>
          <div ref={gridRef} className="list-grid" data-tile-list>
          {orderedList.map((ex) => (
            <div
              key={ex.id}
              data-tile-id={ex.id}
              className={`list-card-wrap${draggedId === ex.id ? ' list-card-wrap--dragging' : ''}`}
              onPointerDown={(e) => handlePointerDown(e, ex)}
              onClickCapture={(e) => { if (didDragRef.current) { e.preventDefault(); e.stopPropagation(); didDragRef.current = false } }}
            >
            <Card
              className={`list-card${ex.category === 'Background effect' ? ' list-card--large' : ''}${ex.category === 'Text effect' ? ' list-card--preview-visible' : ''}${ex.category === 'Button interactions' ? ' list-card--preview-visible' : ''}${draggedId === ex.id ? ' list-card--dragging' : ''}${dragOverId === ex.id ? ' list-card--drag-over' : ''}`}
              style={{ borderRadius: 16 }}
            >
              <div className="list-card-preview">
                {hasLivePreview(ex) ? (
                  ex.previewType === 'component' && ex.componentKey ? (
                    <PreviewErrorBoundary>
                      <div
                        className={`list-card-preview-component${ex.componentKey === 'ThemeTogglerButton' ? ' theme-toggler-preview' : ''}`}
                        onMouseEnter={() => setHoveredPreviewId(ex.id)}
                        onMouseLeave={() => setHoveredPreviewId(null)}
                      >
                        {(() => {
                          const Comp = PREVIEW_COMPONENTS[ex.componentKey]
                          if (!Comp) return null
                          return (
                            <Comp
                              {...(ex.componentProps || {})}
                              interactive={hoveredPreviewId === ex.id}
                              className={
                                ex.componentKey === 'ThemeTogglerButton'
                                  ? 'rounded-xl'
                                  : 'absolute inset-0 rounded-xl'
                              }
                            />
                          )
                        })()}
                      </div>
                    </PreviewErrorBoundary>
                  ) : (
                    <LivePreview
                      previewType={ex.previewType}
                      codeHtml={ex.codeHtml}
                      codeCss={ex.codeCss}
                      codeJs={ex.codeJs}
                      embedUrl={ex.embedUrl}
                      title={ex.title}
                      className="list-card-iframe list-card-iframe--live"
                    />
                  )
                ) : ex.thumbnailUrl ? (
                  <img
                    src={ex.thumbnailUrl}
                    alt=""
                    className="list-card-thumbnail"
                  />
                ) : (
                  <div className="list-card-placeholder">
                    <LinkOutlined className="list-card-placeholder-icon" />
                    <span>View on site</span>
                  </div>
                )}
              </div>
              <div className="list-card-meta">
                <Title level={5} className="list-card-title">
                  <Link to={`/example/${ex.id}`} draggable={false}>{ex.title || 'Untitled'}</Link>
                </Title>
                {ex.sourceUrl && (
                  <Space>
                    <a
                      href={ex.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="list-card-source"
                    >
                      Source
                    </a>
                  </Space>
                )}
              </div>
            </Card>
            </div>
          ))}
          </div>
          {ghostPosition && ghostSize && draggedId && createPortal(
            <div
              className="list-card-ghost"
              style={{
                position: 'fixed',
                left: ghostPosition.x,
                top: ghostPosition.y,
                width: ghostSize.w,
                height: ghostSize.h,
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            >
              <span className="list-card-ghost-title">
                {orderedList.find((e) => e.id === draggedId)?.title || 'Untitled'}
              </span>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  )
}
