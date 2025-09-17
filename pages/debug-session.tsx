import { useSession, signIn, signOut } from 'next-auth/react'

export default function DebugSession() {
  const { data, status } = useSession()
  return (
    <div style={{fontFamily:'sans-serif', padding: 24}}>
      <h1>Debug Session</h1>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <div style={{marginTop: 16}}>
        <button onClick={() => signIn('twitch', { callbackUrl: 'https://www.linnostv.live/debug-session' })}>
          Entrar com Twitch (debug)
        </button>
        <button onClick={() => signOut()} style={{marginLeft: 8}}>
          Sair
        </button>
      </div>
    </div>
  )
}
