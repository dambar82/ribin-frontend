import { User } from "../../store/userSlice"

export type TEditUserRequest = {
  id: number
  email: string
  name: string
  surname: string
  age: number
  password: string
}
export type TEditUserResponse = {
  data: User
}