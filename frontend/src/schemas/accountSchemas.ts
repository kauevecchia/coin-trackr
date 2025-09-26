import { z } from 'zod'

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export const updateUserNameSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(24, 'Name must be less than 24 characters'),
})  

export const resetPasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmNewPassword: z.string().min(8, 'New password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
})

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>
export type UpdateUserNameFormData = z.infer<typeof updateUserNameSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>