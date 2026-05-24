export type PreviewShape = 'spiral' | 'orbit' | 'globe' | 'cube'

function d(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  r: number, alpha: number,
  color: string
) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.globalAlpha = alpha
  ctx.fill()
}

export function drawShapePreview(
  canvas: HTMLCanvasElement,
  shape: PreviewShape,
  active: boolean,
  nightMode: boolean,
  dpr = 1
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const S = 44
  const cx = S / 2
  const cy = S / 2

  ctx.clearRect(0, 0, S, S)

  ctx.fillStyle = active
    ? (nightMode ? '#2a2a2a' : '#1a1a1a')
    : (nightMode ? '#202020' : '#EBEBEB')
  ctx.beginPath()
  ctx.roundRect(0, 0, S, S, 8)
  ctx.fill()

  const fc = active ? '#ffffff' : (nightMode ? '#cccccc' : '#3a3a3a')
  const pa = active ? 0.80 : 0.65
  const sa = active ? 0.42 : 0.35

  switch (shape) {
    case 'spiral': {
      // Concentric tilted ellipses — rings seen at an angle (like a galaxy)
      const tilt = -Math.PI / 6
      const rings = [
        { rx: 5,    ry: 2.2,  n: 12 },
        { rx: 9.5,  ry: 4.2,  n: 20 },
        { rx: 14.5, ry: 6.5,  n: 30 },
        { rx: 19.5, ry: 8.8,  n: 40 },
      ]
      rings.forEach(({ rx, ry, n }) => {
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2
          const ex = rx * Math.cos(angle)
          const ey = ry * Math.sin(angle)
          const px = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt)
          const py = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt)
          d(ctx, px, py, 0.8, pa, fc)
        }
      })
      break
    }

    case 'orbit': {
      // Center planet
      d(ctx, cx, cy, 3.8, pa + 0.1, fc)

      // Ring 1 — small dots + 3 satellite planets
      const r1 = 11
      for (let i = 0; i < 22; i++) {
        const angle = (i / 22) * Math.PI * 2
        d(ctx, cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1, 0.7, sa, fc)
      }
      ;[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach(angle => {
        d(ctx, cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1, 2.3, pa, fc)
      })

      // Ring 2 — small dots + 2 satellite planets
      const r2 = 18
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2
        d(ctx, cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2, 0.7, sa, fc)
      }
      ;[Math.PI / 5, Math.PI + Math.PI / 5].forEach(angle => {
        d(ctx, cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2, 2.3, pa, fc)
      })
      break
    }

    case 'globe': {
      const R = 17

      // Outer circle
      for (let i = 0; i < 44; i++) {
        const angle = (i / 44) * Math.PI * 2
        d(ctx, cx + Math.cos(angle) * R, cy + Math.sin(angle) * R * 0.97, 0.8, pa, fc)
      }

      // Latitude lines (3 horizontal ellipses)
      ;[-R * 0.52, 0, R * 0.52].forEach(yOff => {
        const latR = Math.sqrt(Math.max(0, R * R - yOff * yOff))
        const n = Math.max(8, Math.round(latR * 2.4))
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2
          d(
            ctx,
            cx + Math.cos(angle) * latR,
            cy + yOff + Math.sin(angle) * latR * 0.28,
            0.75, sa + 0.06, fc
          )
        }
      })

      // Longitude lines (3 vertical ellipses at different rotations)
      ;[-Math.PI / 3.5, 0, Math.PI / 3.5].forEach(lonAngle => {
        for (let i = 0; i < 28; i++) {
          const t = (i / 28) * Math.PI * 2
          const x3 = Math.cos(t) * Math.cos(lonAngle)
          const z3 = Math.cos(t) * Math.sin(lonAngle)
          if (lonAngle !== 0 && z3 < -0.15) continue
          d(ctx, cx + x3 * R, cy + Math.sin(t) * R * 0.97, 0.75, sa + 0.06, fc)
        }
      })
      break
    }

    case 'cube': {
      // 3D wireframe cube — dots along edges, larger dots at vertices
      const hs = 11
      const rotY = 0.55
      const rotX = 0.38

      const project = ([vx, vy, vz]: number[]) => {
        const x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY)
        const z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY)
        const y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX)
        const z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX)
        return { x: cx + x1 * hs, y: cy + y2 * hs, z: z2 }
      }

      const verts = [
        [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
        [-1,-1, 1], [1,-1, 1], [1,1, 1], [-1,1, 1],
      ].map(project)

      const edges: [number, number][] = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7],
      ]

      edges.forEach(([ai, bi]) => {
        const va = verts[ai], vb = verts[bi]
        const front = (va.z + vb.z) > 0
        const edgeAlpha = front ? sa + 0.14 : Math.max(0.08, sa - 0.1)
        const dx = vb.x - va.x, dy = vb.y - va.y
        const n = Math.max(2, Math.round(Math.sqrt(dx * dx + dy * dy) / 2.6))
        for (let i = 1; i < n; i++) {
          const t = i / n
          d(ctx, va.x + dx * t, va.y + dy * t, 0.65, edgeAlpha, fc)
        }
      })

      verts.forEach(p => {
        d(ctx, p.x, p.y, p.z > 0 ? 2.1 : 1.5, p.z > 0 ? pa : sa, fc)
      })
      break
    }
  }

  ctx.globalAlpha = 1
}
