import { User } from "../../store/userSlice"
import { Clubs } from "../../types"

export type TEditUserRequest = {
  id: number
  email?: string
  name?: string
  surname?: string
  school?: string
  school_number?: string
  districts_id?: number | null
  birthdate: number
  password?: string
}
export type TEditUserResponse = {
  data: User
}

export type TResetPasswordRequest = {
  email: string
}
export type TResetPasswordResponse = {
  data: {
    staus: string
    message: string
  }
}

export type TRestorePasswordRequest = {
  password: string
}
export type TRestorePasswordResponse = {
  data: {
    staus: string
    message: string
  }
}
