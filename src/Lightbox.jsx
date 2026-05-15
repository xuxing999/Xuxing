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

  const isClosing = closing

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
        animation: isClosing
          ? 'lb-backdrop-out 0.22s ease-in forwards'
          : 'lb-backdrop-in 0.2s ease-out',
      }}
    >
      {/* ── Photo container — fills viewport with slight desktop breathing room ── */}
      <div
        className="lb-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          animation: isClosing
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

        {/* ── Media ── */}
        {item.type === 'video' ? (
          <video
            src={item.video}
            poster={item.image || undefined}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            onLoad={() => setLoadedItemId(item.id)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
        )}

        {/* ── Top bar ── */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '20px 22px',
          zIndex: 3,
          animation: isClosing
            ? 'lb-text-out 0.18s ease-in forwards'
            : 'lb-text-in 0.28s 0.22s ease-out both',
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '3.5px',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 500,
          }}>
            {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
          </span>
        </div>

        {/* ── Bottom gradient ── */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* ── Bottom text: title + meta only ── */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '0 32px 32px',
          textAlign: 'center',
          zIndex: 3,
          animation: isClosing
            ? 'lb-text-out 0.18s ease-in forwards'
            : 'lb-text-in 0.3s 0.22s ease-out both',
        }}>
          {item.meta && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '2.5px',
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 400,
              marginBottom: 8,
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}>
              {item.meta}
            </div>
          )}
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(24px, 4vw, 32px)',
            color: '#fff',
            lineHeight: 1.15,
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}>
            {item.title}
          </div>
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
      >✕</button>

      <style>{`
        /* Responsive container sizing */
        .lb-container {
          width: calc(100vw - 64px);
          height: calc(100dvh - 64px);
          max-width: 820px;
          border-radius: 18px;
        }
        @media (max-width: 767px) {
          .lb-container {
            width: 100vw;
            height: 100dvh;
            border-radius: 0;
          }
        }

        @keyframes lb-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lb-backdrop-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes lb-card-in  {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lb-card-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.97); }
        }
        @keyframes lb-text-in {
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
