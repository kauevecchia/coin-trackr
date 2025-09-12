'use client'

import * as React from 'react'
import { Bitcoin } from 'lucide-react'

import { NavMain } from '@/components/NavMain'
import { NavUser } from '@/components/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import ThemeSelector from '@/components/ThemeSelector'
import { useAuth } from '@/hooks/useAuth'



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = user
    ? {
        name: user.name,
        email: user.email,
      }
    : {
        name: 'User',
        email: 'Loading...',
      }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo rounded-lg p-1.5">
            <Bitcoin className="h-6 w-6 text-muted dark:text-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text">
            CoinTrackr
          </h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <ThemeSelector />
      <Separator />
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
