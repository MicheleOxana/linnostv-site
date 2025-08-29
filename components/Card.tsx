import React from 'react'
export default function Card({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`card p-5 ${className}`}>
      {children}
    </div>
  )
}
