import { headers } from 'next/headers'
import 'server-only'

export interface SidebarUser {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

// Helper pour récupérer les données utilisateur depuis les headers
export async function getUserFromHeaders(): Promise<SidebarUser | null> {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')
    const userEmail = headersList.get('x-user-email')
    const userName = headersList.get('x-user-name')
    const userRole = headersList.get('x-user-role')
    console.log(userId, userEmail, userName, userRole)
    if (!userId) {
      return null
    }

    return {
      id: userId,
      name: userName || 'Utilisateur',
      email: userEmail || '',
      avatar: '/avatars/default.jpg',
      role: userRole || 'user'
    }
  } catch (error) {
    console.error('Error getting user from headers:', error)
    return null
  }
} 