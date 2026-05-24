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
    drawShapePreview(canvas, shape, active, nightMode)
  }, [shape, active, nightMode])

  return (
    <button
      onClick={onClick}
      title={label}
      className="relative flex flex-col items-center gap-1 group"
      aria-pressed={active}
      aria-label={label}
    >
      <canvas
        ref={canvasRef}
        width={44}
        height={44}
        className="rounded-lg"
        style={{
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
