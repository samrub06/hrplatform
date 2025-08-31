import { getUserDataAction } from '@/app/actions/user'
import AccountSettingsPage from './page-client'


// Main page component - Server Component
export default async function AccountPage() {
  // Use Server Action to get user data
  const userData = await getUserDataAction()
  
  return (
      <AccountSettingsPage initialUserData={userData} />
  )

} 
