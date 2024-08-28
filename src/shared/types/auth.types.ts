import { User } from "../../store/userSlice"

export type TLoginUserRequest = {
  email: string
  password: string
}
export type TLoginUserResponse = {
  client: User
  token: string
  message: string
  errors?: any
}

export type TRegisterUserRequest = {
  name: string
  surname: string
  email: string
  password: string
}
export type TRegisterUserResponse = {
  client: User
  token: string
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
