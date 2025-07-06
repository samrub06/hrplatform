import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AuthDAL } from "@/lib/dal/auth"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HR Platform',
  description: 'HR Platform for managing human resources',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await AuthDAL.getUserBasic()
  
  const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: null },
    { title: "Users", url: "/users", icon: null },
    { title: "Contacts", url: "/contacts", icon: null },
    { title: "Referrals", url: "/referrals", icon: null },
    { title: "Reports", url: "/reports", icon: null },
    { title: "Settings", url: "/settings", icon: null },
  ]
  
  const sidebarData = {
    user: {
      id: user?.userId || '',
      name: user?.email?.split('@')[0] || 'User',
      email: user?.email || '',
      avatar: '/avatars/default.jpg',
      role: user?.role || 'user'
    },
    teams: [
      {
        name: "Acme Inc",
        logo: null, // Will be mapped to GalleryVerticalEnd in AppSidebar
        plan: "Enterprise",
      },
    ],
    navMain: navMain
  }

  return (
    <SidebarProvider>
      <AppSidebar userData={sidebarData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 