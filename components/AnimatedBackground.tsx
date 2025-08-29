import React, { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // Floating particles in Linnos palette
    const colors = ['#00FF84', '#4DA6FF', '#A64DFF', '#FF4DD8']
    const circles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    let raf = 0
    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      circles.forEach(c => {
        c.x += c.dx; c.y += c.dy
        if (c.x < 0 || c.x > w) c.dx *= -1
        if (c.y < 0 || c.y > h) c.dy *= -1
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
        ctx.fillStyle = c.color
        ctx.globalAlpha = 0.6
        ctx.fill()
        ctx.globalAlpha = 1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}
