import { api } from './api'

export interface UpdateNameRequest {
  name: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface DeleteAccountRequest {
  password: string
}

export const accountService = {
  async updateName(data: UpdateNameRequest) {
    const response = await api.patch('/users/update-name', data)
    return response.data
  },

  async updatePassword(data: UpdatePasswordRequest) {
    const response = await api.patch('/users/reset-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    })
    return response.data
  },

  async deleteAccount(data: DeleteAccountRequest) {
    const response = await api.delete(`/users/delete-account`, {
      data: {
        password: data.password,
      },
    })
    return response.data
  },
}
