'use server'

import { backendFetch } from '@/lib/backendFetch'
import { Candidate, type UserData } from '@/lib/types'

// Get user data for account settings
export async function getUserDataAction(): Promise<UserData | null> {
  try {
    const response = await backendFetch('/user/me', {
      method: 'GET',
      credentials: 'include'
    })
    
    if (!response) {
      return null
    }

    // Transform server data to client format
    return {
      id: response.id,
      first_name: response.first_name,
      last_name: response.last_name,
      email: response.email,
      role: response.role,
      current_position: response.current_position,
      current_company: response.current_company,
      desired_position: response.desired_position,
      salary_expectation: response.salary_expectation,
      years_experience: response.years_experience,
      phone_number: response.phone_number,
      github_link: response.github_link,
      linkedin_link: response.linkedin_link,
      public_profile_url: response.public_profile_url,
      birthday: response.birthday,
      profilePicture: response.profilePicture,
      cv: response.cv,
      updatedAt: new Date(response.updatedAt)
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

// Get candidates data
export async function getCandidatesAction(): Promise<Candidate[]> {
  try {
    const response = await backendFetch('/candidates', {
      method: 'GET',
      credentials: 'include'
    })
    
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response
    }
    
    // If response is not an array, return empty array
    return []
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return []
  }
}

// Get candidate details
export async function getCandidateDetailsAction(candidateId: string): Promise<any | null> {
  try {
    const response = await backendFetch(`/candidates/${candidateId}`, {
      method: 'GET',
      credentials: 'include'
    })
    
    return response || null
  } catch (error) {
    console.error('Error fetching candidate details:', error)
    return null
  }
} 