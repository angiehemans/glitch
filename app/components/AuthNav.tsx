'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <span>Loading...</span>
  }

  if (session) {
    return (
      <div className="nav-authenticated">
        <Link href="/dashboard" className="dashboard-link">
          Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="nav-unauthenticated">
      <Link href="/login" className="auth-link">
        Login
      </Link>
    </div>
  )
}
