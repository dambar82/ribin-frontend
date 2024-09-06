import { ReactNode } from "react"
import { Button } from "../../../shared/UI"
import { useAppDispatch } from "../../../store/hooks"
import { joinTheClub } from "../../../store/clubsSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/store"

import c from '../SingleClubPage.module.scss'

interface JoinTheClubButtonProps {
  children: ReactNode
  club_id: number
  joined: boolean
}
const JoinTheClubButton = ({ children, club_id, joined }: JoinTheClubButtonProps) => {

  const user = useSelector((state: RootState) => state.user.user)

  const dispatch = useAppDispatch()

  const joinTheClubHandler = () => {
    dispatch(joinTheClub({
      sendObj: { client_id: user.id },
      club_id,
      user
    }))
  }

  if ( joined ) {
    return (
      <Button className={c.joined_button} >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Вы в клубе
      </Button>
    )
  }

  return (
    <Button onClick={joinTheClubHandler} >{children}</Button>
  )
}

export { JoinTheClubButton }