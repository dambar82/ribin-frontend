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

export type TCreateClubRequest = {
  name: string
  description: string
}
export type TCreateClubResponse = {
  
}