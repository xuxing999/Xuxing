import { useRef, useEffect, useState, useCallback } from 'react'
import { works } from './data/works.js'
import SignatureBackground from './SignatureBackground.jsx'

// ─── Constants ────────────────────────────────────────────────────────────────
const N              = works.length
const ROT_SPEED      = 0.0008
const APEX_ANGLE     = 3 * Math.PI / 2    // 270° = topmost point in CSS coords
const CARD_SIZE_APEX = 72                 // smallest (at arc top)
const CARD_SIZE_END  = 112                // largest (at arc sides/bottom)
const CARD_HOVER_MAX = 152
const INFLUENCE      = 120

// Desktop: cards span 220° of the full circle (apex ± 110°).
// Gap = 360° − 220° = 140°, which is smaller than the ~164° visible window.
const APEX        = 3 * Math.PI / 2
const HALF_SPAN   = 110 * (Math.PI / 180)
const START_ANGLE = APEX - HALF_SPAN
const END_ANGLE   = APEX + HALF_SPAN
const BASE_ANGLES_DESKTOP = works.map((_, i) =>
  START_ANGLE + i * (END_ANGLE - START_ANGLE) / (N - 1)
)

// Mobile: full 360° orbit, evenly spaced
const BASE_ANGLES_MOBILE = works.map((_, i) => i * (2 * Math.PI / N))

// Stable per-card wobble: ±8° on top of tangent rotation
const WOBBLE = works.map((_, i) => ((i * 173.31 + 17) % 16) - 8)

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function getArc(vw, vh, isMobile) {
  if (isMobile) {
    return {
      arcCX: vw / 2,
      arcCY: vh * 0.50,
      R: vw * 0.55,   // intentionally larger than screen — cards bleed off edges
    }
  }
  return {
    arcCX: vw / 2,
    arcCY: vh * 0.87,
    R: Math.min(vh * 0.62, vw * 0.38),
  }
}

function cardBaseSize(angle, isMobile) {
  if (isMobile) return 68
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
  const rotRef      = useRef(0)
  const isMobileRef = useRef(window.innerWidth < 768)
  const arcRef      = useRef(getArc(window.innerWidth, window.innerHeight, isMobileRef.current))
  const prevTsRef   = useRef(null)

  const [cardStates, setCardStates] = useState(() => works.map(() => ({
    x: 0, y: 0, baseSize: 80, rotation: 0, scale: 1,
  })))
  const [previewWork,    setPreviewWork]    = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [vh, setVh] = useState(() => window.innerHeight)
  const [vw, setVw] = useState(() => window.innerWidth)

  const avatarY = isMobile ? vh * 0.50 : vh * 0.63

  // Resize
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight
      const mobile = w < 768
      isMobileRef.current = mobile
      arcRef.current = getArc(w, h, mobile)
      setIsMobile(mobile)
      setVh(h)
      setVw(w)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Mouse (desktop only)
  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // RAF — drives rotation + hover scaling (both mobile and desktop)
  useEffect(() => {
    const loop = (ts) => {
      const dt    = prevTsRef.current ? Math.min(ts - prevTsRef.current, 50) : 16.667
      prevTsRef.current = ts

      const mobile = isMobileRef.current
      const { arcCX, arcCY, R } = arcRef.current
      rotRef.current += ROT_SPEED * (dt / 16.667)
      const rotOff = rotRef.current
      const mouse  = mouseRef.current

      const baseAngles = mobile ? BASE_ANGLES_MOBILE : BASE_ANGLES_DESKTOP

      let closestIdx = null, closestDist = mobile ? Infinity : 55

      const next = works.map((_, i) => {
        const angle    = baseAngles[i] + rotOff
        const x        = arcCX + R * Math.cos(angle)
        const y        = arcCY + R * Math.sin(angle)
        const baseSize = cardBaseSize(angle, mobile)
        const tangentDeg = Math.atan2(Math.cos(angle), -Math.sin(angle)) * (180 / Math.PI)
        const rotation   = tangentDeg + WOBBLE[i]

        let scale = 1
        if (!mobile) {
          const dist     = Math.hypot(mouse.x - x, mouse.y - y)
          const maxScale = CARD_HOVER_MAX / baseSize
          scale = dist >= INFLUENCE ? 1
            : 1 + (maxScale - 1) * (0.5 - 0.5 * Math.cos(Math.PI * (1 - dist / INFLUENCE)))
          if (dist < 55) { closestDist = dist; closestIdx = i }
        }

        return { x, y, baseSize, rotation, scale }
      })

      setCardStates(next)
      if (!mobile) {
        if (closestIdx !== null) {
          setPreviewWork(works[closestIdx])
          setPreviewVisible(true)
        } else {
          setPreviewVisible(false)
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleCardClick = (work) => {
    if (isMobile) {
      // On mobile: tap to preview; if already previewing this work, navigate
      if (previewWork?.id === work.id && previewVisible) {
        if (work.url && work.url !== '#') window.open(work.url, '_blank', 'noopener,noreferrer')
      } else {
        setPreviewWork(work)
        setPreviewVisible(true)
      }
    } else {
      if (work.url && work.url !== '#') window.open(work.url, '_blank', 'noopener,noreferrer')
    }
  }

  const dismissPreview = () => setPreviewVisible(false)

  // ─── Render (unified) ─────────────────────────────────────────────────────
  return (
    <div
      onClick={isMobile && previewVisible ? dismissPreview : undefined}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#eeecea',
        overflow: 'hidden',
      }}
    >
      {/* Signature background (desktop only) */}
      {!isMobile && <SignatureBackground />}

      {/* Left vertical text (desktop only) */}
      {!isMobile && (
        <div style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%) rotate(180deg)', writingMode: 'vertical-rl', fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontWeight: 300, fontSize: 10, letterSpacing: '1.5px', color: '#999', lineHeight: 1.6, pointerEvents: 'none', userSelect: 'none', zIndex: 1, maxHeight: '60vh' }}>
          A collection of — the experiments, the prototypes, and the visions — built with AI tools and released into the world.
        </div>
      )}

      {/* Mobile top label */}
      {isMobile && (
        <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '3px', color: '#aaa', whiteSpace: 'nowrap', zIndex: 10, userSelect: 'none' }}>
          XUXING LAB — AI WORKS
        </div>
      )}

      {/* Rotating arc cards */}
      {cardStates.map((s, i) => {
        const { x, y, baseSize, rotation, scale } = s
        const size   = baseSize * scale
        const zIndex = Math.round(scale * 10) + 1
        const work   = works[i]

        // On mobile, fade out cards behind the avatar area
        const isActive = isMobile
          ? !(y > vh * 0.35 && y < vh * 0.5 && Math.abs(x - vw / 2) < 60)
          : true

        return (
          <div key={work.id}
            onClick={(e) => { e.stopPropagation(); handleCardClick(work) }}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top:  y - size / 2,
              width:  size,
              height: size,
              borderRadius: Math.round(size * 0.19),
              background: hexToRgba(work.color, 0.20),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: work.image ? 0 : size * 0.43,
              overflow: 'hidden',
              transform: `rotate(${rotation}deg)`,
              zIndex,
              cursor: 'pointer',
              willChange: 'left, top, width, height',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.3s ease',
              boxShadow: scale > 1.15
                ? `0 ${Math.round(6 * scale)}px ${Math.round(20 * scale)}px rgba(0,0,0,0.13)`
                : '0 2px 10px rgba(0,0,0,0.07)',
            }}
          >
            {work.image
              ? <img src={work.image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
              : work.emoji
            }
          </div>
        )
      })}

      {/* Avatar + brand */}
      <div style={{ position: 'absolute', left: '50%', top: avatarY, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 15, userSelect: 'none' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e05a2b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 4px 24px rgba(224,90,43,0.28)' }}><PersonSVG /></div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '3px', color: '#111', marginBottom: 6 }}>煦行</div>
        {!isMobile && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '2.5px', color: '#666' }}>XUXING LAB — AI WORKS</div>}
      </div>

      {/* Bottom fog gradient — desktop always, mobile only when preview panel is open */}
      {!isMobile && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, zIndex: 11, pointerEvents: 'none', background: 'linear-gradient(to top, #eeecea 0%, #eeecead8 20%, transparent 100%)' }} />
      )}

      {/* Hint label */}
      <div style={{
        position: 'absolute',
        bottom: previewVisible ? (isMobile ? 210 : 190) : 26,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 10,
        letterSpacing: '3.5px',
        color: '#aaa',
        whiteSpace: 'nowrap',
        zIndex: 12,
        transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {isMobile ? 'TAP TO PREVIEW · TAP AGAIN TO VISIT' : 'HOVER TO PREVIEW · CLICK TO VISIT'}
      </div>

      {/* Preview panel */}
      <PreviewPanel work={previewWork} visible={previewVisible} isMobile={isMobile} />
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

function PreviewPanel({ work, visible, isMobile }) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0%' : '110%'})`,
        width: isMobile ? '100%' : 560,
        background: '#fff',
        borderRadius: isMobile ? '0' : '16px 16px 0 0',
        padding: isMobile ? '20px 24px 32px' : '24px 28px',
        zIndex: 20,
        transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 14 : 20,
      }}
    >
      {/* White fog above panel — fully opaque at bottom so rounded corners seal cleanly */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          top: -64,
          left: 0,
          right: 0,
          height: 64,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.38) 55%, rgba(255,255,255,1) 100%)',
        }} />
      )}
      {work && (<>
        {/* Drag handle on mobile */}
        {isMobile && (
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#ddd', alignSelf: 'center', marginBottom: 4 }} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
          <div style={{ width: 64, height: 64, borderRadius: 13, flexShrink: 0, background: hexToRgba(work.color, 0.18), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: work.image ? 0 : 28, overflow: 'hidden' }}>
            {work.image
              ? <img src={work.image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : work.emoji
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '2.5px', color: '#aaa', marginBottom: 4, fontWeight: 500 }}>PREVIEWING</div>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: isMobile ? 18 : 20, color: '#111', marginBottom: 3, lineHeight: 1.2 }}>{work.title}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#777', marginBottom: isMobile ? 10 : 12, fontWeight: 300 }}>{work.desc}</div>
            <a href={work.url !== '#' ? work.url : undefined} target="_blank" rel="noopener noreferrer"
              onClick={e => { if (work.url === '#') e.preventDefault() }}
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '1.5px', color: work.color, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, opacity: work.url === '#' ? 0.4 : 1 }}>
              VISIT PROJECT ↗
            </a>
          </div>
        </div>
      </>)}
    </div>
  )
}
