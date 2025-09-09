import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Lock } from 'lucide-react'
import { accountService } from '@/services/account.service'
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/schemas/accountSchemas'
import { toast } from 'sonner'

const ResetPasswordModal = () => {
  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await accountService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      })
      toast.success('Password updated successfully!')
      setOpen(false)
      reset()
    } catch (error: any) {
      console.error('Update password error:', error)
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect. Please try again.')
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Invalid password format.')
      } else {
        toast.error('Error updating password. Please try again.')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Lock className="h-4 w-4 text-primary-foreground dark:text-foreground" />
          <span className="text-primary-foreground dark:text-foreground">
            Reset Password
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your current password and the new password you desire.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field }) => (
                <Input
                  {...field}
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  className={errors.currentPassword ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <Input
                  {...field}
                  id="newPassword"
                  type="password"
                  placeholder="Enter the new password"
                  className={errors.newPassword ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm the new password"
                  className={errors.confirmNewPassword ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground dark:text-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordModal