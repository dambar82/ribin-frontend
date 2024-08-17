import { Clubs } from "../../types"

export type TCreateClubRequest = {
  name: string
  description: string
}
export type TCreateClubResponse = {
  
}

export type TGetClubRequest = {
  id: string
}
export type TGetClubResponse = {
  data: Clubs
}

