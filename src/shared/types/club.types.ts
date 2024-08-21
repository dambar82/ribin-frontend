import { Clubs } from "../../types"

export type TCreateClubRequest = {
  name: string
  description: string
}
export type TCreateClubResponse = Clubs

export type TGetClubRequest = {
  id: string
}
export type TGetClubResponse = {
  data: Clubs
}

export type TEditClubRequest = FormData
export type TEditClubResponse = Clubs

export type TJoinTheClubRequest = {
  client_id: number
}
export type TJoinTheClubResponse = {
  message: string
  status?: 'error'
}

export type TCreateClubEventRequest = FormData
export type TCreateClubEventResponse = {

}