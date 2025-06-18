import type { Candidate, CV as CVType, Experience as ExperienceType, Skill as SkillType } from './types';

// Modèle User avec méthodes statiques
export class User {
  static async list(sortBy?: string, limit?: number): Promise<Candidate[]> {
    // Mock implementation - à remplacer par de vrais appels API
    // TODO: Implémenter le tri et la limite quand l'API sera connectée
    console.log('Sort by:', sortBy, 'Limit:', limit);
    
    return [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        role_type: 'candidate',
        profile_complete: true,
        availability: 'immediately',
        years_experience: 5,
        desired_salary: 120000,
        bio: 'Experienced software developer with expertise in React and Node.js',
        portfolio_url: 'https://johndoe.dev',
        linkedin_url: 'https://linkedin.com/in/johndoe',
        github_url: 'https://github.com/johndoe',
        created_date: '2024-01-15T10:00:00Z',
        updated_date: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        role_type: 'candidate',
        profile_complete: false,
        availability: '2_weeks',
        years_experience: 3,
        desired_salary: 95000,
        bio: 'Frontend developer passionate about user experience',
        created_date: '2024-01-10T14:30:00Z',
        updated_date: '2024-01-10T14:30:00Z'
      }
    ];
  }

  static async me(): Promise<Candidate | null> {
    // Mock implementation
    return null;
  }
}

// Modèle CV avec méthodes statiques
export class CVModel {
  static async list(): Promise<CVType[]> {
    // Mock implementation
    return [];
  }

  static async filter(filters: { user_id: string }): Promise<CVType[]> {
    // Mock implementation
    return [
      {
        id: 'cv1',
        file_name: 'john_doe_resume.pdf',
        file_url: '/files/john_doe_resume.pdf',
        created_date: '2024-01-15T10:00:00Z',
        user_id: filters.user_id
      }
    ];
  }
}

// Modèle Skill avec méthodes statiques
export class SkillModel {
  static async list(): Promise<SkillType[]> {
    // Mock implementation
    return [];
  }

  static async filter(filters: { user_id: string }): Promise<SkillType[]> {
    // Mock implementation
    return [
      {
        id: 'skill1',
        skill_name: 'React',
        years_of_experience: 3,
        user_id: filters.user_id
      },
      {
        id: 'skill2',
        skill_name: 'TypeScript',
        years_of_experience: 2,
        user_id: filters.user_id
      },
      {
        id: 'skill3',
        skill_name: 'Node.js',
        years_of_experience: 4,
        user_id: filters.user_id
      }
    ];
  }
}

// Modèle Experience avec méthodes statiques
export class ExperienceModel {
  static async list(): Promise<ExperienceType[]> {
    // Mock implementation
    return [];
  }

  static async filter(filters: { user_id: string }): Promise<ExperienceType[]> {
    // Mock implementation
    return [
      {
        id: 'exp1',
        position_title: 'Senior Frontend Developer',
        company_name: 'Tech Corp',
        start_date: '2022-01-01T00:00:00Z',
        end_date: '2024-01-01T00:00:00Z',
        is_current: false,
        user_id: filters.user_id
      },
      {
        id: 'exp2',
        position_title: 'Frontend Developer',
        company_name: 'Startup Inc',
        start_date: '2024-01-01T00:00:00Z',
        is_current: true,
        user_id: filters.user_id
      }
    ];
  }
}

// Alias pour compatibilité
export const CV = CVModel;
export const Skill = SkillModel;
export const Experience = ExperienceModel; 