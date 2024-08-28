import { ReactNode } from "react"
import { Button } from "../../../shared/UI"
import { useAppDispatch } from "../../../store/hooks"
import { joinTheClub } from "../../../store/clubsSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/store"

interface JoinTheClubButtonProps {
  children: ReactNode
  club_id: number
}
const JoinTheClubButton = ({ children, club_id }: JoinTheClubButtonProps) => {

  const user = useSelector((state: RootState) => state.user.user)

  const dispatch = useAppDispatch()

  const joinTheClubHandler = () => {
    dispatch(joinTheClub({
      sendObj: { client_id: user.id },
      club_id,
      user
    }))
  }

  return (
    <Button onClick={joinTheClubHandler} >{children}</Button>
  )
}

export { JoinTheClubButton }