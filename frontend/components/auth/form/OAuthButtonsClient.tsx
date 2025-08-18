'use client'

import { Button } from '@/components/common/button'
import { Icons } from '@/components/common/icons'

function getBackendApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000'
  return raw.endsWith('/api') ? raw : `${raw}/api`
}

export default function OAuthButtonsClient() {
  const handleGoogleLogin = () => {
    window.location.href = `${getBackendApiBase()}/auth/google`
  }

  const handleLinkedInLogin = () => {
    window.location.href = `${getBackendApiBase()}/auth/linkedin`
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <Button variant="outline" onClick={handleLinkedInLogin}>
        <Icons.linkedin className="mr-2 h-4 w-4" />
        LinkedIn
      </Button>
      <Button variant="outline" onClick={handleGoogleLogin}>
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  )
}

