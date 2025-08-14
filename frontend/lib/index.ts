// Main exports from lib directory

// Core utilities
export * from './utils';

// HTTP client
export { default as axiosInstance } from './axiosInstance';

// Error handling
export * from './apiErrorHandler';
export * from './errorHandler';

// Authentication
export * from './dal/auth';
export * from './hooks/useAuth';
export * from './session';

// Services
export * from './services/fileUpload';

// Stores
export * from './stores/form-cache-store';

// Types and models - export explicitly to avoid conflicts
export type {
  Candidate, CandidateData, CandidateFiltersType, CV, Experience, Skill, UserData
} from './types';

export {
  CVModel, ExperienceModel, SkillModel, User
} from './models';
