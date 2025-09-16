// components/LoginButton.tsx
import React from 'react'

const scopes = [
  'user:read:email',         // email do usuário
  'chat:read',
  'chat:edit'
  // adicione outros que você precisar depois
]

function buildAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI!
  const state = typeof window !== 'undefined'
    ? window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
    : Math.random().toString(36).slice(2)

  // opcional: persistir state pra conferir no callback
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('twitch_oauth_state', state)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    state
  })

  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
}

export default function LoginButton() {
  const handleLogin = () => {
    const url = buildAuthUrl()
    window.location.href = url
  }

  return (
    <button
      onClick={handleLogin}
      className="px-3 py-1.5 rounded-xl border border-white/20 bg-black/60 text-white text-sm hover:bg-white/10 transition"
      aria-label="Entrar com Twitch"
    >
      🔑 Entrar com Twitch
    </button>
  )
}
