import { Clubs } from "../../types"
import { TEvent } from "./event.types"

export type TCreateClubRequest = {
  name: string
  description: string
}
export type TCreateClubResponse = {
  data: Clubs
}

export type TGetClubRequest = {
  id: string
}
export type TGetClubResponse = {
  data: Clubs
}

export type TEditClubRequest = FormData
export type TEditClubResponse = {
  data: Clubs
}

export type TJoinTheClubRequest = {
  client_id: number
}
export type TJoinTheClubResponse = {
  message: string
  status?: 'error'
}

export type TCreateClubEventRequest = FormData
export type TCreateClubEventResponse = {
  data: TEvent
}