import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/SiteHeader'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { TransactionsProvider } from '@/contexts/TransactionsContext'
import { PageTransition } from '@/components/PageTransition'
import { LoadingProvider } from '@/contexts/LoadingContext'
import { ContentLoadingOverlay } from '@/components/ContentLoadingOverlay'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <TransactionsProvider>
        <LoadingProvider>
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
              <main className="flex-1 px-8 py-4 md:px-12 md:py-8 min-w-0 relative">
                <PageTransition>
                  {children}
                </PageTransition>
                <ContentLoadingOverlay />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </LoadingProvider>
      </TransactionsProvider>
    </ProtectedRoute>
  )
};

export default AppLayout;