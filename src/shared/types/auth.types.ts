import { User } from "../../store/userSlice"

export type TLoginUserRequest = {
  email: string
  password: string
}
export type TLoginUserResponse = {
  client?: User
  token?: string
  message: string
  errors?: any
  status?: "email_not_verified"
  user_id?: number
}

export type TRegisterUserRequest = {
  name: string
  surname: string
  email: string
  password: string
}
export type TRegisterUserResponse = {
  email_confirmed: false
}

export type TCheckAuthResponse = {
  data: User
}

export type TConfirmEmailRequest = {
  client_id?: number
  hash?: string
}
export type TConfirmEmailResponse = {
  status: 'success' | 'error'
  message: string
}
