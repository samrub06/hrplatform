"use client"

import {
  BarChart3,
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings,
  SquareTerminal,
  Users,
  type LucideIcon
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: {
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      role?: string
    }
    teams: Array<{
      name: string
      logo: LucideIcon | null
      plan: string
    }>
    navMain: Array<{
      title: string
      url: string
      icon: LucideIcon | null
    }>
  }
}

// Icon mapping for navigation items
const getIconForTitle = (title: string): LucideIcon => {
  switch (title.toLowerCase()) {
    case "dashboard":
      return SquareTerminal
    case "users":
      return Users
    case "contacts":
      return Bot
    case "referrals":
      return BookOpen
    case "reports":
      return BarChart3
    case "settings":
      return Settings
    default:
      return SquareTerminal
  }
}

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  // Map icons to navigation items
  const navMainWithIcons = userData.navMain.map(item => ({
    ...item,
    icon: item.icon || getIconForTitle(item.title)
  }))

  // Map icons to teams
  const teamsWithIcons = userData.teams.map(team => ({
    ...team,
    logo: team.logo || GalleryVerticalEnd
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsWithIcons} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithIcons} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
