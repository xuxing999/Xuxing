import { useEffect, useRef, useState, useCallback } from 'react'

export default function Lightbox({ item, onClose }) {
  const [loadedItemId, setLoadedItemId] = useState(null)
  const imgLoaded = loadedItemId === item?.id
  const [closing,  setClosing]          = useState(false)
  const closeRef                        = useRef(null)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => { setClosing(false); onClose() }, 220)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    if (!item) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [item])

  // Escape key + focus close button
  useEffect(() => {
    if (!item) return
    const handler = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    const t = setTimeout(() => closeRef.current?.focus(), 60)
    return () => { window.removeEventListener('keydown', handler); clearTimeout(t) }
  }, [item, handleClose])

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Photo'}
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: closing
          ? 'lb-backdrop-out 0.22s ease-in forwards'
          : 'lb-backdrop-in 0.2s ease-out',
      }}
    >
      {/* ── Wrapper column: photo + text below ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 'min(520px, 92vw)',
          maxHeight: '92dvh',
          animation: closing
            ? 'lb-card-out 0.22s ease-in forwards'
            : 'lb-card-in 0.3s ease-out',
        }}
      >
        {/* ── Photo ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          flexShrink: 1,
          minHeight: 0,
        }}>
          {/* Loading placeholder */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.04)',
            opacity: imgLoaded ? 0 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }} />

          {item.type === 'video' ? (
            <video
              src={item.video}
              poster={item.image || undefined}
              controls
              style={{ width: '100%', display: 'block', maxHeight: '68dvh', objectFit: 'contain' }}
            />
          ) : (
            <img
              src={item.image}
              alt={item.title}
              onLoad={() => setLoadedItemId(item.id)}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '68dvh',
                display: 'block',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.35s ease',
              }}
            />
          )}
        </div>

        {/* ── Text below photo ── */}
        <div style={{
          width: '100%',
          padding: '18px 4px 4px',
          textAlign: 'center',
          flexShrink: 0,
          animation: closing
            ? 'lb-text-out 0.18s ease-in forwards'
            : 'lb-text-in 0.3s 0.18s ease-out both',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.35)',
            fontWeight: 500,
            marginBottom: 8,
          }}>
            {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
          </div>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(20px, 4vw, 26px)',
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: item.meta ? 6 : 0,
          }}>
            {item.title}
          </div>
          {item.meta && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              letterSpacing: '1.5px',
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 300,
              marginBottom: item.desc ? 10 : 0,
            }}>
              {item.meta}
            </div>
          )}
          {item.desc && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 300,
              lineHeight: 1.78,
              maxWidth: '88%',
              margin: '0 auto',
            }}>
              {item.desc}
            </div>
          )}
        </div>
      </div>

      {/* ── Close button ── */}
      <button
        ref={closeRef}
        onClick={handleClose}
        aria-label="關閉"
        style={{
          position: 'absolute',
          top: 20, right: 20,
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
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
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.24)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
      >✕</button>

      <style>{`
        @keyframes lb-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lb-backdrop-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes lb-card-in  { from { opacity: 0; transform: scale(0.97) } to { opacity: 1; transform: scale(1) } }
        @keyframes lb-card-out { from { opacity: 1; transform: scale(1) }   to { opacity: 0; transform: scale(0.97) } }
        @keyframes lb-text-in  { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes lb-text-out { from { opacity: 1; transform: translateY(0) }   to { opacity: 0; transform: translateY(4px) } }
      `}</style>
    </div>
  )
}
