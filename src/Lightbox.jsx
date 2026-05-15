import { useEffect, useRef, useState, useCallback } from 'react'

export default function Lightbox({ item, onClose }) {
  // Track which item id has finished loading — avoids cached-image race condition
  const [loadedItemId, setLoadedItemId] = useState(null)
  const imgLoaded = loadedItemId === item?.id
  const [closing,  setClosing]          = useState(false)
  const closeRef                        = useRef(null)

  // Triggered close — play exit animation then call onClose
  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 220)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    if (!item) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [item])

  // Escape key + focus close button on item change
  useEffect(() => {
    if (!item) return
    const handler = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    // Defer focus so animation has started
    const t = setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      window.removeEventListener('keydown', handler)
      clearTimeout(t)
    }
  }, [item, handleClose])

  if (!item) return null

  const animState = closing ? 'closing' : 'open'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Photo'}
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: animState === 'closing'
          ? 'lb-backdrop-out 0.22s ease-in forwards'
          : 'lb-backdrop-in 0.2s ease-out',
      }}
    >
      {/* ── Photo container ─────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(480px, 92vw)',
          maxHeight: '88svh',
          borderRadius: 18,
          overflow: 'hidden',
          flexShrink: 0,
          animation: animState === 'closing'
            ? 'lb-card-out 0.22s ease-in forwards'
            : 'lb-card-in 0.3s ease-out',
        }}
      >
        {/* Loading placeholder */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.04)',
          opacity: imgLoaded ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* ── Media ──────────────────────────────────────────── */}
        {item.type === 'video' ? (
          <video
            src={item.video}
            poster={item.image || undefined}
            controls
            style={{
              width: '100%',
              display: 'block',
              maxHeight: '88svh',
              objectFit: 'cover',
            }}
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            onLoad={() => setLoadedItemId(item.id)}
            style={{
              width: '100%',
              display: 'block',
              maxHeight: '88svh',
              objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
        )}

        {/* ── Top bar ────────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 3,
          animation: animState === 'closing'
            ? 'lb-text-out 0.18s ease-in forwards'
            : 'lb-text-in 0.28s 0.2s ease-out both',
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '3.5px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 500,
          }}>
            {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
          </span>
        </div>

        {/* ── Bottom gradient overlay ─────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* ── Bottom text ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 28px 30px',
          textAlign: 'center',
          zIndex: 3,
          animation: animState === 'closing'
            ? 'lb-text-out 0.18s ease-in forwards'
            : 'lb-text-in 0.28s 0.2s ease-out both',
        }}>
          {item.meta && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '2.5px',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 400,
              marginBottom: 8,
              textShadow: '0 1px 6px rgba(0,0,0,0.45)',
            }}>
              {item.meta}
            </div>
          )}
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(22px, 5.5vw, 28px)',
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: item.desc ? 12 : 0,
            textShadow: '0 1px 10px rgba(0,0,0,0.45)',
          }}>
            {item.title}
          </div>
          {item.desc && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: 'rgba(255,255,255,0.72)',
              fontWeight: 300,
              lineHeight: 1.78,
              maxWidth: '82%',
              margin: '0 auto',
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}>
              {item.desc}
            </div>
          )}
        </div>
      </div>

      {/* ── Close button (outside photo, top-right of backdrop) ── */}
      <button
        ref={closeRef}
        onClick={handleClose}
        aria-label="關閉"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 15,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.18s',
          zIndex: 51,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
      >
        ✕
      </button>

      <style>{`
        @keyframes lb-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lb-backdrop-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes lb-card-in  {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lb-card-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.96); }
        }
        @keyframes lb-text-in  {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lb-text-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(6px); }
        }
      `}</style>
    </div>
  )
}
