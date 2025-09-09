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
import { PencilLine } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { accountService } from '@/services/account.service'
import { toast } from 'sonner'
import { UpdateUserNameFormData, updateUserNameSchema } from '@/schemas/accountSchemas'

const UpdateNameModal = () => {
  const [open, setOpen] = useState(false)
  const { user, updateUser } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateUserNameFormData>({
    resolver: zodResolver(updateUserNameSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
    },
  })

  const onSubmit = async (data: UpdateUserNameFormData) => {
    try {
      await accountService.updateName(data)
      toast.success('Name updated successfully!')
      setOpen(false)
      reset()
      // Update user data immediately in the UI
      updateUser({ name: data.name })
    } catch (error) {
      reset()
      toast.error('Error updating name. Try again.')
      console.error('Update name error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PencilLine className="h-4 w-4 text-primary-foreground dark:text-foreground" />
          <span className="text-primary-foreground dark:text-foreground">
            Edit name
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Name</DialogTitle>
          <DialogDescription>
            Enter your new name below. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Enter your name"
                  className={errors.name ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
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
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default UpdateNameModal
