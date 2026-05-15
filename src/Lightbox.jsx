import { useEffect } from 'react'

export default function Lightbox({ item, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!item) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [item, onClose])

  if (!item) return null

  return (
    // Backdrop — click outside card closes
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(238,236,234,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'lb-fade-in 0.28s ease-out',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.08)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >✕</button>

      {/* Card — stop click from bubbling to backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
          width: '90vw',
          maxWidth: 480,
          animation: 'lb-card-in 0.28s ease-out',
        }}
      >
        {/* Media area */}
        {item.type === 'video' ? (
          <video
            src={item.video}
            poster={item.image || undefined}
            controls
            style={{ width: '100%', display: 'block', aspectRatio: '16/9', background: '#111' }}
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
          />
        )}

        {/* Info */}
        <div style={{ padding: '16px 20px 20px' }}>
          <div style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 8.5,
            letterSpacing: '2.5px',
            color: '#bbb',
            marginBottom: 5,
            fontWeight: 500,
          }}>
            {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
          </div>
          <div style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 19,
            color: '#111',
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {item.title}
          </div>
          {item.meta && (
            <div style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              color: '#bbb',
              fontWeight: 400,
              letterSpacing: '1px',
              marginBottom: item.desc ? 10 : 0,
            }}>
              {item.meta}
            </div>
          )}
          {item.desc && (
            <div style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              color: '#555',
              fontWeight: 300,
              lineHeight: 1.75,
            }}>
              {item.desc}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes lb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lb-card-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
