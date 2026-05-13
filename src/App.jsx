import { useRef, useEffect, useState, useCallback } from 'react'
import { works } from './data/works.js'
import SignatureBackground from './SignatureBackground.jsx'

// ─── Constants ────────────────────────────────────────────────────────────────
const N              = works.length
// 35-second full revolution: 2π / (60fps × 35s) ≈ 0.003 rad/frame
const ROT_SPEED      = 0.0008
const APEX_ANGLE     = 3 * Math.PI / 2    // 270° = topmost point in CSS coords
const CARD_SIZE_APEX = 72                 // smallest (at arc top)
const CARD_SIZE_END  = 112                // largest (at arc sides/bottom)
const CARD_HOVER_MAX = 152
const INFLUENCE      = 120

// Cards span 220° of the full circle (apex ± 110°).
// Gap = 360° − 220° = 140°, which is smaller than the ~164° visible window,
// so the gap is always hidden in the fog zone — rotation is seamless.
const APEX        = 3 * Math.PI / 2               // 270° = topmost point
const HALF_SPAN   = 110 * (Math.PI / 180)         // 110° in radians
const START_ANGLE = APEX - HALF_SPAN              // ≈ 160°
const END_ANGLE   = APEX + HALF_SPAN              // ≈ 380° (= 20°)
const BASE_ANGLES = works.map((_, i) => START_ANGLE + i * (END_ANGLE - START_ANGLE) / (N - 1))

// Stable per-card wobble: ±8° on top of tangent rotation
const WOBBLE = works.map((_, i) => ((i * 173.31 + 17) % 16) - 8)

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// Arc geometry — large radius so arc top sits near viewport top (~15%)
// arcCY is the geometric center of the circle (near lower viewport)
function getArc(vw, vh) {
  return {
    arcCX: vw / 2,
    arcCY: vh * 0.87,
    R: Math.min(vh * 0.62, vw * 0.38),
  }
}

// Size of a card based on its current angle on the circle
function cardBaseSize(angle) {
  const norm     = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const diff     = Math.abs(norm - APEX_ANGLE)
  const circDiff = Math.min(diff, 2 * Math.PI - diff)
  const t        = Math.min(circDiff / (Math.PI * 0.55), 1)
  return CARD_SIZE_APEX + (CARD_SIZE_END - CARD_SIZE_APEX) * t
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const mouseRef    = useRef({ x: -9999, y: -9999 })
  const rafRef      = useRef(null)
  const rotRef      = useRef(0)        // accumulates rotation offset (rad)
  const arcRef      = useRef(getArc(window.innerWidth, window.innerHeight))
  const prevTsRef   = useRef(null)

  const [cardStates, setCardStates] = useState(() => works.map(() => ({
    x: 0, y: 0, baseSize: 80, rotation: 0, scale: 1,
  })))
  const [previewWork,    setPreviewWork]    = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [vh, setVh] = useState(() => window.innerHeight)

  // Avatar visual Y — matches reference: sits at ~63% height, inside the arch
  const avatarY = vh * 0.63

  // Resize
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight
      arcRef.current = getArc(w, h)
      setIsMobile(w < 768)
      setVh(h)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Mouse
  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // RAF — drives both rotation and hover scaling
  useEffect(() => {
    if (isMobile) return

    const loop = (ts) => {
      const dt    = prevTsRef.current ? Math.min(ts - prevTsRef.current, 50) : 16.667
      prevTsRef.current = ts

      const { arcCX, arcCY, R } = arcRef.current
      rotRef.current += ROT_SPEED * (dt / 16.667)
      const rotOff = rotRef.current
      const mouse  = mouseRef.current

      let closestIdx = null, closestDist = 55

      const next = works.map((_, i) => {
        const angle    = BASE_ANGLES[i] + rotOff
        const x        = arcCX + R * Math.cos(angle)
        const y        = arcCY + R * Math.sin(angle)
        const baseSize = cardBaseSize(angle)

        // Rotation: tangent direction of the circle at this angle + per-card wobble
        const tangentDeg = Math.atan2(Math.cos(angle), -Math.sin(angle)) * (180 / Math.PI)
        const rotation   = tangentDeg + WOBBLE[i]

        // Dock magnification — max hover size relative to each card's base size
        const dist     = Math.hypot(mouse.x - x, mouse.y - y)
        const maxScale = CARD_HOVER_MAX / baseSize
        const scale    = dist >= INFLUENCE ? 1
          : 1 + (maxScale - 1) * (0.5 - 0.5 * Math.cos(Math.PI * (1 - dist / INFLUENCE)))

        if (dist < closestDist) { closestDist = dist; closestIdx = i }

        return { x, y, baseSize, rotation, scale }
      })

      setCardStates(next)
      if (closestIdx !== null) {
        setPreviewWork(works[closestIdx])
        setPreviewVisible(true)
      } else {
        setPreviewVisible(false)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isMobile])

  const handleCardClick = (url) => {
    if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer')
  }

  // ─── MOBILE ───────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ background: '#eeecea', minHeight: '100vh', paddingBottom: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 56, paddingBottom: 32, position: 'relative' }}>
          <div style={{ position: 'fixed', top: 0, right: -8, pointerEvents: 'none', zIndex: 0, fontFamily: "'DM Serif Display',serif", fontStyle: 'italic', fontSize: 64, color: 'rgba(255,255,255,0.55)', letterSpacing: '-2px', lineHeight: 1 }}>AI works</div>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e05a2b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, zIndex: 1 }}><PersonSVG /></div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '3px', color: '#111', marginBottom: 6 }}>煦行</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '2.5px', color: '#666' }}>XUXING LAB — AI WORKS</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 24px' }}>
          {works.map((work, i) => (
            <div key={work.id} onClick={() => handleCardClick(work.url)}
              style={{ background: hexToRgba(work.color, 0.15), borderRadius: 16, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, cursor: work.url !== '#' ? 'pointer' : 'default', transform: `rotate(${WOBBLE[i] * 0.5}deg)`, transition: 'transform 0.2s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >{work.emoji}</div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40, fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '3px', color: '#aaa' }}>TAP TO VISIT</div>
      </div>
    )
  }

  // ─── DESKTOP ──────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#eeecea', overflow: 'hidden' }}>

      {/* Cursive signature background — drawn on load */}
      <SignatureBackground />

      {/* Left vertical text */}
      <div style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%) rotate(180deg)', writingMode: 'vertical-rl', fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontWeight: 300, fontSize: 10, letterSpacing: '1.5px', color: '#999', lineHeight: 1.6, pointerEvents: 'none', userSelect: 'none', zIndex: 1, maxHeight: '60vh' }}>
        A collection of — the experiments, the prototypes, and the visions — built with AI tools and released into the world.
      </div>

      {/* Rotating arc cards */}
      {cardStates.map((s, i) => {
        const { x, y, baseSize, rotation, scale } = s
        const size   = baseSize * scale
        const zIndex = Math.round(scale * 10) + 1
        return (
          <div key={works[i].id}
            onClick={() => handleCardClick(works[i].url)}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top:  y - size / 2,
              width:  size,
              height: size,
              borderRadius: Math.round(size * 0.19),
              background: hexToRgba(works[i].color, 0.20),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: size * 0.43,
              transform: `rotate(${rotation}deg)`,
              zIndex,
              cursor: works[i].url !== '#' ? 'pointer' : 'default',
              willChange: 'left, top, width, height',
              boxShadow: scale > 1.15
                ? `0 ${Math.round(6 * scale)}px ${Math.round(20 * scale)}px rgba(0,0,0,0.13)`
                : '0 2px 10px rgba(0,0,0,0.07)',
            }}
          >{works[i].emoji}</div>
        )
      })}

      {/* Avatar + brand */}
      <div style={{ position: 'absolute', left: '50%', top: avatarY, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, userSelect: 'none' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e05a2b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 4px 24px rgba(224,90,43,0.28)' }}><PersonSVG /></div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '3px', color: '#111', marginBottom: 6 }}>煦行</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '2.5px', color: '#666' }}>XUXING LAB — AI WORKS</div>
      </div>

      {/* Bottom fog gradient — z above cards, below panel */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, zIndex: 11, pointerEvents: 'none', background: 'linear-gradient(to top, #eeecea 0%, #eeecead8 20%, transparent 100%)' }} />

      {/* Hint label */}
      <div style={{ position: 'absolute', bottom: previewVisible ? 190 : 26, left: '50%', transform: 'translateX(-50%)', fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '3.5px', color: '#aaa', whiteSpace: 'nowrap', zIndex: 12, transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)', userSelect: 'none' }}>
        HOVER TO PREVIEW · CLICK TO VISIT
      </div>

      {/* Preview panel */}
      <PreviewPanel work={previewWork} visible={previewVisible} />
    </div>
  )
}

function PersonSVG() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
      <ellipse cx="22" cy="14" rx="10" ry="11" fill="rgba(0,0,0,0.52)" />
      <path d="M2 50c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="rgba(0,0,0,0.52)" />
    </svg>
  )
}

function PreviewPanel({ work, visible }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: `translateX(-50%) translateY(${visible ? '0%' : '110%'})`, width: 560, background: '#fff', borderRadius: '16px 16px 0 0', padding: '24px 28px', zIndex: 20, transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)', opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', boxShadow: '0 -8px 40px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', gap: 20 }}>
      {work && (<>
        <div style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0, background: hexToRgba(work.color, 0.18), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{work.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '2.5px', color: '#aaa', marginBottom: 6, fontWeight: 500 }}>PREVIEWING</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#111', marginBottom: 4, lineHeight: 1.2 }}>{work.title}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#777', marginBottom: 12, fontWeight: 300 }}>{work.desc}</div>
          <a href={work.url !== '#' ? work.url : undefined} target="_blank" rel="noopener noreferrer" onClick={e => { if (work.url === '#') e.preventDefault() }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '1.5px', color: work.color, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, opacity: work.url === '#' ? 0.4 : 1 }}>VISIT PROJECT ↗</a>
        </div>
      </>)}
    </div>
  )
}
