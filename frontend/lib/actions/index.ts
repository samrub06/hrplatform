// Main exports for all Server Actions
export * from './auth'
export * from './user'

// Re-export commonly used actions for convenience
export { loginAction, logoutAction, registerAction } from './auth'
export {
    getUserDataAction, updateCVAction, updateContactInfoAction, updateEducationAction, updatePersonalInfoAction, updateProfessionalInfoAction, updateProfilePictureAction, updateSkillsAction
} from './user'
