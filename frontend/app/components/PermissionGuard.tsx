import { Permission } from '@/app/api/login/route'
import { cookies } from 'next/headers'

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermission?: {
    domain: string
    action: 'read' | 'create' | 'edit' | 'delete'
  }
}

async function getPermissions(): Promise<Permission[]> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('auth-token')

  if (!token) {
    return []
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions`, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  })

  if (!response.ok) {
    return []
  }

  return response.json()
}

export default async function PermissionGuard({ 
  children, 
  requiredPermission 
}: PermissionGuardProps) {
  const permissions = await getPermissions()

  if (requiredPermission) {
    const hasPermission = permissions.some(p => 
      p.domain === requiredPermission.domain && 
      p[`can_${requiredPermission.action}`]
    )

    if (!hasPermission) {
      return <div>Accès non autorisé</div>
    }
  }

  return <>{children}</>
} 