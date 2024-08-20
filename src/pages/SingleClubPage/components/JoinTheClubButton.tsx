import { ReactNode } from "react"
import { Button } from "../../../shared/UI"
import { useAppDispatch } from "../../../store/hooks"
import { joinTheClub } from "../../../store/clubsSlice"

interface JoinTheClubButtonProps {
  children: ReactNode
}
const JoinTheClubButton = ({ children }: JoinTheClubButtonProps) => {

  const dispatch = useAppDispatch()

  const joinTheClubHandler = () => {
    dispatch(joinTheClub({}))
  }

  return (
    <Button onClick={joinTheClubHandler} >{children}</Button>
  )
}

export { JoinTheClubButton }