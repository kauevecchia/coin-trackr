'use client'

import { Separator } from '@/components/ui/separator'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import UpdateNameModal from '@/components/UpdateNameModal'
import ResetPasswordModal from '@/components/ResetPasswordModal'
import { DeleteAccountModal } from '@/components/DeleteAccountModal'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FadeInUp } from '@/components/PageTransition'

const Account = () => {
  const { user } = useAuth()
  const { logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <motion.div 
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading account information...
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
    toast.success('See you next time!')
  }

  return (
    <div>
      <div>
        <FadeInUp>
          <h1 className="text-3xl font-bold">My account</h1>
        </FadeInUp>
        <motion.div 
          className="bg-card text-card-foreground p-4 flex flex-col gap-4 rounded-xl border shadow-sm w-full mt-8 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold">Your name</h2>
            <div className="flex gap-3 items-center">
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {user.name}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UpdateNameModal />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Separator />
          </motion.div>
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold">Your email</h2>
            <motion.span 
              className="flex gap-3 items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              {user.email}
            </motion.span>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <Separator />
          </motion.div>
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold">Reset Password</h2>
            <motion.div 
              className="flex gap-3 items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ResetPasswordModal />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            <Separator />
          </motion.div>
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold">Delete Account</h2>
            <motion.div 
              className="flex gap-3 items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DeleteAccountModal />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
          >
            <Separator />
          </motion.div>
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold">Logout</h2>
            <motion.div 
              className="flex gap-3 items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="destructive"
                className="bg-destructive text-primary-foreground dark:text-foreground hover:bg-destructive/90 transition-colors duration-200"
                onClick={handleLogout}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogOut className="h-4 w-4" />
                </motion.div>
                <span className="text-primary-foreground dark:text-foreground">
                  Logout
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Account