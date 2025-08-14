'use client'

import { useEffect, useState } from 'react';

interface Skill {
  id: string
  name: string
}

interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  github_link?: string
  linkedin_link?: string
  public_profile_url?: string
  cv?: {
    fileName: string
    id: string
    name: string
  } | null
  role?: string
  adminNotes?: string
  profilePicture?: string
  years_of_experience?: number
  skills: Skill[]
  desired_position?: string
  salary_expectation?: string
  current_position?: string
  current_company?: string
  createdAt: Date
  updatedAt: Date
  birthday?: Date
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: Date
    endDate?: Date
    description?: string
  }[]
}

const fetchUserData = async (): Promise<UserData> => {
  const response = await fetch('/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: envoie les cookies
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }

  return response.json()
}

export const useUser = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await fetchUserData();
        setData(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    fetchUserData()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err : new Error('Unknown error')))
      .finally(() => setIsLoading(false));
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    isSuccess: !!data && !error,
    isError: !!error
  };
} 