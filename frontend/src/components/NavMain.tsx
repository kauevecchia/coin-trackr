'use client'

import {
  CirclePlus,
  TrendingUp,
  Wallet,
  BarChart3,
} from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { NewTransactionModal } from './NewTransactionModal'

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: Wallet,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: TrendingUp,
    },
  ],
};

export function NavMain() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SidebarGroup>
      <NewTransactionModal isOpen={isOpen} onOpenChange={setIsOpen} />
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => router.push(item.url)}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator />
        <SidebarMenuItem className="flex items-center gap-2">
          <SidebarMenuButton
            tooltip="Quick Create"
            className="bg-gradient-to-r from-primary to-primary-glow text-muted dark:text-foreground hover:text-muted hover:scale-[1.03] transition-all cursor-pointer min-w-8 duration-200 ease-linear"
            onClick={() => setIsOpen(true)}
          >
            <CirclePlus />
            <span className="font-medium">New Transaction</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
