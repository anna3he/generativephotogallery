'use client'

import { useEffect, useRef } from 'react'
import { drawShapePreview, type PreviewShape } from '@/lib/shapePreview'

interface Props {
  shape: PreviewShape
  active: boolean
  nightMode: boolean
  onClick: () => void
  label: string
}

export default function ShapePreviewCanvas({ shape, active, nightMode, onClick, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = 44 * dpr
    canvas.height = 44 * dpr
    drawShapePreview(canvas, shape, active, nightMode, dpr)
  }, [shape, active, nightMode])

  return (
    <button
      onClick={onClick}
      title={label}
      className="relative flex flex-col items-center group"
      style={{ gap: 'var(--s3)' }}
      aria-pressed={active}
      aria-label={label}
    >
      <canvas
        ref={canvasRef}
        width={44}
        height={44}
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          outline: active ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
          outlineOffset: '1px',
          transition: 'outline-color 0.15s',
        }}
      />
      <span
        className="type-label transition-colors"
        style={{ color: active ? (nightMode ? '#FAFAFA' : '#0A0A0A') : nightMode ? '#777777' : '#AAAAAA' }}
      >
        {label}
      </span>
    </button>
  )
}
