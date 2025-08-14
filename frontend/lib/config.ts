/**
 * Configuration centralisée pour l'application
 */
export const config = {
  // API Configuration
  api: {
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api',
    timeout: 10000, // 10 seconds
  },
  
  // Cache Configuration
  cache: {
    userProfile: {
      revalidate: 300, // 5 minutes
      tags: ['user-profile']
    }
  },
  
  // Feature Flags
  features: {
    enableServerSideRendering: true,
    enableClientSideFallback: true,
  }
}

/**
 * Helper pour déterminer l'environnement
 */
export const isServer = typeof window === 'undefined'
export const isClient = typeof window !== 'undefined'
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production' 