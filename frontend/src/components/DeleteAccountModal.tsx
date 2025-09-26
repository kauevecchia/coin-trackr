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
import { Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { accountService } from '@/services/account.service'
import { toast } from 'sonner'
import { deleteAccountSchema } from '@/schemas/accountSchemas'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

export const DeleteAccountModal = () => {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = async (data: DeleteAccountFormData) => {
    try {
      await accountService.deleteAccount({
        password: data.password,
      })
      logout()
      router.push('/login')
      toast.success('Account deleted successfully!')
      setOpen(false)
      reset()
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Incorrect password. Try again.')
        } else {
          toast.error(error.response?.data?.message || 'Error deleting account')
        }
      } else {
        toast.error('Internal server error')
      }
    }
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="bg-destructive text-primary-foreground dark:text-foreground hover:bg-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-primary-foreground dark:text-foreground">
            Delete Account
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm the deletion of your account,
            enter your password below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3">
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className={errors.password ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}