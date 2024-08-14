import { User } from "../../store/userSlice"

export type TLoginUserRequest = {
  email: string
  password: string
}
export type TLoginUserResponse = {
  client: User
  token: string
}

export type TCheckAuthResponse = {
  data: User
}