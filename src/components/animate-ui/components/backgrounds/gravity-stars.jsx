import { useRef, useEffect, useCallback } from 'react'

/**
 * Gravity Stars Background – interactive gravity stars effect.
 * Props match animate-ui GravityStarsBackground API.
 */
export function GravityStarsBackground({
  starsCount = 120,
  starsSize = 0.7,
  starsOpacity = 0.85,
  glowIntensity = 6,
  movementSpeed = 0.3,
  mouseInfluence = 100,
  mouseGravity = 'attract',
  gravityStrength = 75,
  starsInteraction = false,
  className = '',
  style = {},
  ...props
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: null, y: null })
  const starsRef = useRef(null)
  const rafRef = useRef(null)

  const initStars = useCallback(
    (w, h) => {
      const stars = []
      for (let i = 0; i < starsCount; i++) {
        const ox = Math.random() * w
        const oy = Math.random() * h
        stars.push({
          x: ox,
          y: oy,
          ox,
          oy,
          vx: 0,
          vy: 0,
        })
      }
      return stars
    },
    [starsCount]
  )

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let stars = []

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 3)

    function resize() {
      const rect = container.getBoundingClientRect()
      const nw = Math.max(1, Math.floor(rect.width))
      const nh = Math.max(1, Math.floor(rect.height))
      if (nw !== w || nh !== h) {
        w = nw
        h = nh
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        stars = initStars(w, h)
        starsRef.current = stars
      }
    }

    function draw() {
      if (!ctx || w <= 0 || h <= 0 || !stars.length) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgb(244, 245, 244)'
      ctx.fillRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const hasMouse = mx != null && my != null
      const speed = movementSpeed * 0.5
      const influence = (mouseInfluence / 100) * Math.min(w, h) * 0.002
      const strength = (gravityStrength / 100) * 0.5
      const sign = mouseGravity === 'repel' ? -1 : 1

      const returnSpring = 0.012
      const returnDamping = 0.88
      const snapDist = 0.8

      const mouseRadius = 30

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        let inMouseRadius = false

        if (hasMouse) {
          const dx = mx - s.x
          const dy = my - s.y
          const d = Math.sqrt(dx * dx + dy * dy) || 0.001
          if (d < mouseRadius) {
            inMouseRadius = true
            const f = (sign * influence) / (d * 0.01 + 1)
            s.vx += (dx / d) * f
            s.vy += (dy / d) * f
          }
        }

        if (!inMouseRadius) {
          const dx = s.ox - s.x
          const dy = s.oy - s.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
          if (dist <= snapDist) {
            s.x = s.ox
            s.y = s.oy
            s.vx = 0
            s.vy = 0
          } else {
            const spring = dist * returnSpring
            const fx = (dx / dist) * Math.min(spring, 4)
            const fy = (dy / dist) * Math.min(spring, 4)
            s.vx += fx
            s.vy += fy
            s.vx *= returnDamping
            s.vy *= returnDamping
          }
        }

        if (starsInteraction && stars.length > 1 && hasMouse) {
          for (let j = i + 1; j < stars.length; j++) {
            const o = stars[j]
            const dx = o.x - s.x
            const dy = o.y - s.y
            const d = Math.sqrt(dx * dx + dy * dy) || 1
            if (d < 80) {
              const f = (strength / (d * 0.1 + 1)) * 0.02
              s.vx += (dx / d) * f
              s.vy += (dy / d) * f
              o.vx -= (dx / d) * f
              o.vy -= (dy / d) * f
            }
          }
        }

        const damp = hasMouse ? 0.98 : 0.99
        s.vx *= damp
        s.vy *= damp
        s.x += s.vx * speed
        s.y += s.vy * speed

        if (s.x < 0 || s.x > w) s.vx *= -0.5
        if (s.y < 0 || s.y > h) s.vy *= -0.5
        s.x = Math.max(0, Math.min(w, s.x))
        s.y = Math.max(0, Math.min(h, s.y))

        const g = glowIntensity / 15
        const r = Math.max(0.5, starsSize * (1 + g * 0.2))
        ctx.save()
        ctx.globalAlpha = starsOpacity
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath()
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
        ctx.fill()
        if (glowIntensity > 0) {
          const glowR = r * 1.5
          ctx.globalAlpha = starsOpacity * 0.2 * Math.min(1, glowIntensity / 15)
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR)
          grad.addColorStop(0, 'rgba(41, 63, 201, 0.2)')
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: null, y: null }
    }

    function tick() {
      resize()
      draw()
    }

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(tick)
      : null
    if (ro) ro.observe(container)

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', tick)
    resize()
    draw()

    return () => {
      if (ro) ro.disconnect()
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', tick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [
    initStars,
    movementSpeed,
    mouseInfluence,
    mouseGravity,
    gravityStrength,
    starsInteraction,
    starsCount,
    starsSize,
    starsOpacity,
    glowIntensity,
  ])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: 'hidden',
        background: 'var(--color-preview-bg, #f4f5f4)',
        ...style,
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
