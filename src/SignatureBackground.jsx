import { useEffect, useState } from 'react'

/**
 * "Xuxing" in Alex Brush cursive, filled white, revealed left→right on page load.
 * Animation: a clipPath rect sweeps across the text in the direction of the baseline
 * (i.e., along the −18° diagonal), giving the feel of a pen writing the word.
 */
export default function SignatureBackground() {
  const [ready, setReady] = useState(false)
  const [vw, setVw] = useState(() => window.innerWidth)
  const [vh, setVh] = useState(() => window.innerHeight)

  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => {
      if (cancelled) return
      // small settle so browser applies the font before CSS transition fires
      const t = setTimeout(() => { if (!cancelled) setReady(true) }, 180)
      return () => clearTimeout(t)
    })
    return () => { cancelled = true }
  }, [])

  const fontSize = Math.min(Math.round(vw * 0.17), 260)
  const cx = vw / 2
  const cy = Math.round(vh * 0.43)

  // Clip rect lives in the *rotated* coordinate space of the <g> element,
  // so sweeping its width reveals text naturally along the baseline direction.
  const rectX = cx - 820          // start well left of the text
  const rectY = cy - fontSize     // above ascenders
  const rectH = fontSize * 2.2    // tall enough for descenders
  const rectWMax = 1800           // wider than any possible text extent

  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${vw} ${vh}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/*
        clipPathUnits="userSpaceOnUse" + being referenced inside the rotated <g>
        means the rect coords are interpreted in the ROTATED coordinate system —
        so the sweep goes along the text baseline, not the screen horizontal.
      */}
      <defs>
        <clipPath id="xuxing-reveal" clipPathUnits="userSpaceOnUse">
          <rect
            x={rectX}
            y={rectY}
            width={ready ? rectWMax : 0}
            height={rectH}
            style={{
              transition: ready
                ? 'width 2.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s'
                : 'none',
            }}
          />
        </clipPath>
      </defs>

      <g transform={`rotate(-18, ${cx}, ${cy})`}>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Alex Brush', cursive"
          fontSize={fontSize}
          fill="rgba(255,255,255,0.32)"
          clipPath="url(#xuxing-reveal)"
        >
          Xuxing
        </text>
      </g>
    </svg>
  )
}
