import { User } from "../../../store/userSlice"

export const getMostActiveUsers = ( users: User[] | undefined, quantity: number ) => {

  if (users) {
    //@ts-ignore
    const sorted = users?.toSorted((a, b) => a.rubick - b.rubick)

    if ( !sorted ) return []

    return sorted.slice((-1)*quantity).reverse()
  }
}