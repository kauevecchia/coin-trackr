'use client'

import { Separator } from '@/components/ui/separator'
import { User, CreditCard, Crown, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import UpdateNameModal from '@/components/UpdateNameModal'
import ResetPasswordModal from '@/components/ResetPasswordModal'
import { DeleteAccountModal } from '@/components/DeleteAccountModal'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Account = () => {
  const { user } = useAuth()
  const { logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading account information...</p>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    toast.success('See you next time!')
    router.push('/login')
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">My account</h1>
        <div className="bg-card text-card-foreground p-4 flex flex-col gap-4 rounded-xl border shadow-sm w-full mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your name</h2>
            <div className="flex gap-3 items-center">
              <p>{user.name}</p>
              <UpdateNameModal />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your email</h2>
            <span className="flex gap-3 items-center">{user.email}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Reset Password</h2>
            <div className="flex gap-3 items-center">
              <ResetPasswordModal />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Delete Account</h2>
            <div className="flex gap-3 items-center">
              <DeleteAccountModal />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Logout</h2>
            <div className="flex gap-3 items-center">
              <Button
                variant="destructive"
                className="bg-destructive text-primary-foreground dark:text-foreground hover:bg-destructive/90"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-primary-foreground dark:text-foreground">
                  Logout
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account