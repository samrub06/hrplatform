'use server'

import axiosInstance from '@/lib/axiosInstance'
import { cookies } from 'next/headers'

export async function getUserData() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      throw new Error('No authentication token')
    }

    const response = await axiosInstance.get('/user')
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return { success: false, error: 'Failed to fetch user data' }
  }
} 