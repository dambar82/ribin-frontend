import { User } from "../../store/userSlice"
import { Clubs } from "../../types"

export type TEditUserRequest = {
  id: number
  email?: string
  name?: string
  surname?: string
  school?: string
  school_number?: string
  birthdate: number
  password?: string
}
export type TEditUserResponse = {
  data: User
}
