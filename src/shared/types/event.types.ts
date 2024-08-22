import { User } from "../../store/userSlice"

export type TEvent = {
  id: number
  name: string
  description: string
  caption: string
  date: string
  time: string
  city: string
  location: string
  clients: User[]
  created_by: { id: number, name: string, surname: string }
}


export type TGetEventsResponse = {
  data: TEvent[]
}

export type TGetEventResponse = {
  data: TEvent
}

export type TParticipateInEventResponse = {
  
}
