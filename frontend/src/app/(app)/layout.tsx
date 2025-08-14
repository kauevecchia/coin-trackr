import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/SiteHeader'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 px-8 py-4 md:px-12 md:py-8 min-w-0">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}