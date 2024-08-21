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

  const { id } = useSelector((state: RootState) => state.user.user)

  const dispatch = useAppDispatch()

  const joinTheClubHandler = () => {
    dispatch(joinTheClub({
      sendObj: { client_id: id },
      club_id
    }))
  }

  return (
    <Button onClick={joinTheClubHandler} >{children}</Button>
  )
}

export { JoinTheClubButton }