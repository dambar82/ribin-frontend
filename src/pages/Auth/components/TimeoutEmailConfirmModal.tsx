import { useParams } from 'react-router-dom'
import { Button, Logo } from '../../../shared/UI'
import { useAppDispatch } from '../../../store/hooks'
import { resendConfirmEmail } from '../../../store/userSlice'

import c from './confirmEmailModal.module.scss'

interface TimeoutConfirmEmailModalProps {
  client_id: number | undefined
}
const TimeoutConfirmEmailModal = ({ client_id }: TimeoutConfirmEmailModalProps) => {

  const dispatch = useAppDispatch();
  const params = useParams()

  const onSubmit = () => {
    dispatch(resendConfirmEmail({ client_id, hash: params.hash }))
  }

  return (
    <div className={c.modal} >
      
      <div className={c.logo} >
        <Logo />
      </div>

      <div className={c.modal_body} >

        <div className={c.text_wrapper} >
          <p className={c.title} >Время ссылки истекло</p>
          <p className={c.text} >Ссылка для подтверждения больше не активна. Пожалуйста, запросите новую, чтобы продолжить.</p>
        </div>

        <Button onClick={onSubmit} >Запросить повторно</Button>
      </div>

    </div>
  )
}

export { TimeoutConfirmEmailModal }