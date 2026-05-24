'use client'

import { useState } from 'react'
import { getColors } from '@/lib/tokens'

interface Props {
  open: boolean
  images: HTMLImageElement[]
  nightMode: boolean
  onClose: () => void
  onDelete: (indices: number[]) => void
  onReset: () => void
}

export default function PhotoManageModal({
  open,
  images,
  nightMode,
  onClose,
  onDelete,
  onReset,
}: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  if (!open) return null

  const c  = getColors(nightMode)
  const bg = nightMode ? 'rgba(17,17,17,0.98)' : 'rgba(249,249,249,0.97)'

  const toggleSelect = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleDeleteSelected = () => {
    if (selected.size > 0) {
      onDelete(Array.from(selected))
      setSelected(new Set())
    }
  }

  const handleReset = () => {
    onReset()
    setSelected(new Set())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: nightMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{
          background: bg,
          border: `1px solid ${c.line}`,
          boxShadow: nightMode ? 'none' : '0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--s4) var(--s6)',
            borderBottom: `1px solid ${c.line}`,
          }}
        >
          <h2
            className="type-h3"
            style={{
              color: c.t1,
              fontWeight: nightMode ? 500 : 500,
            }}
          >
            Manage Photos
            <span className="type-body" style={{ color: c.t3, marginLeft: 'var(--s2)', fontWeight: 400 }}>
              {images.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg flex items-center justify-center transition-colors"
            style={{
              width: 28,
              height: 28,
              background: nightMode ? c.bg3 : c.bg3,
              color: c.t3,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
          </button>
        </div>

        {/* Photo grid */}
        <div className="max-h-[300px] overflow-y-auto" style={{ padding: 'var(--s4)' }}>
          {images.length === 0 ? (
            <p className="type-body text-center" style={{ padding: 'var(--s8) 0', color: c.t3 }}>
              No photos uploaded
            </p>
          ) : (
            <div className="grid grid-cols-5" style={{ gap: 'var(--s2)' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => toggleSelect(i)}
                  className="relative aspect-square rounded-lg overflow-hidden transition-all"
                  style={{
                    outline: selected.has(i) 
                      ? '2px solid #ef4444' 
                      : '2px solid transparent',
                    outlineOffset: '-2px',
                    opacity: selected.has(i) ? 0.7 : 1,
                  }}
                >
                  <img
                    src={img.src}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selected.has(i) && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'white' }}>close</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--s3) var(--s6)',
            borderTop: `1px solid ${c.line}`,
          }}
        >
          <button
            onClick={handleReset}
            className="type-caption rounded-lg transition-colors"
            style={{
              padding: 'var(--s2) var(--s3)',
              background: nightMode ? c.bg3 : '#eee',
              color: c.t3,
              fontWeight: nightMode ? 500 : 400,
            }}
          >
            Reset All
          </button>

          <div className="flex items-center" style={{ gap: 'var(--s2)' }}>
            {selected.size > 0 && (
              <span
                className="type-caption"
                style={{ color: c.t3, fontWeight: nightMode ? 500 : 400 }}
              >
                {selected.size} selected
              </span>
            )}
            <button
              onClick={handleDeleteSelected}
              disabled={selected.size === 0}
              className="type-caption rounded-lg transition-all"
              style={{
                padding: 'var(--s2) var(--s3)',
                background: selected.size > 0 ? '#ef4444' : nightMode ? c.bg3 : '#eee',
                color: selected.size > 0 ? '#fff' : c.t4,
                cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                fontWeight: nightMode ? 500 : 400,
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
