import { useNavigate, useParams } from 'react-router-dom'
import { Button, Logo } from '../../shared/UI'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearUser, confirmEmail, resendConfirmEmail } from '../../store/userSlice'

import c from './components/confirmEmailModal.module.scss'
import { useEffect } from 'react'
import { SuccessConfirmEmailModal, TimeoutConfirmEmailModal } from './components'

interface ConfirmEmailModalProps {
  email: string
  user_id: number
}
const ConfirmEmailModal = ({ email, user_id }: ConfirmEmailModalProps) => {
  
  const confirmEmailStatus = useAppSelector(state => state.user.confirmEmailStatus)
  const user = useAppSelector(state => state.user.user)

  const navigate = useNavigate()
  const params = useParams()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if ( params.hash ) {
      dispatch(confirmEmail({ hash: params.hash }))
    }
  }, [params])

  const resendEmailConfirmation = () => {
    dispatch(resendConfirmEmail({ client_id: user_id, hash: params.hash }))
  }

  const cancelHandler = () => {
    navigate('/login')
    dispatch(clearUser())
  }

  if ( user?.email_confirmed ) {
    navigate('/')
    return
  }

  if ( confirmEmailStatus?.status === 'success' ) {
    return <SuccessConfirmEmailModal />
  }

  if ( confirmEmailStatus?.status === 'error' ) {
    return <TimeoutConfirmEmailModal client_id={user_id} />
  }

  return (
    <div className={c.modal} >
      
      <div className={c.logo} >
        <Logo />
      </div>

      <div className={c.modal_body} >

        <svg width="126" height="126" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_2181_8926)"><path d="M110.723 47.25H98.6475C96.075 50.82 93.1875 54.18 90.2475 57.225C90.93 57.54 91.7175 57.75 92.505 57.75H110.723C112.035 57.75 113.243 58.275 114.082 59.115L79.5375 79.5375C79.4325 79.1175 79.38 78.54 79.3275 78.0675C79.065 75.8625 78.645 72.3975 76.0725 70.1925C74.655 71.3475 73.395 72.2925 72.3975 73.0275C69.6675 75.075 66.4125 76.125 63 76.125C59.5875 76.125 56.3325 75.075 53.6025 73.0275C52.605 72.2925 51.345 71.3475 49.9275 70.1925C47.355 72.3975 46.935 75.8625 46.6725 78.0675C46.62 78.75 46.515 79.6425 46.62 79.6425L11.9175 59.115C12.7575 58.275 13.965 57.75 15.2775 57.75H33.495C34.2825 57.75 35.07 57.54 35.7525 57.225C32.8125 54.18 29.925 50.82 27.3525 47.25H15.2775C6.8775 47.25 0 53.97 0 62.265V110.985C0 119.28 6.8775 126 15.2775 126H110.723C119.122 126 126 119.28 126 110.985V62.265C126 53.97 119.122 47.25 110.723 47.25ZM115.5 110.985C115.5 113.452 113.295 115.5 110.723 115.5H15.2775C12.705 115.5 10.5 113.452 10.5 110.985V70.5075L39.5325 87.6225C39.4275 88.1475 39.375 88.6725 39.375 89.25C39.375 93.66 42.945 96.18 45.0975 97.7025C45.57 98.0175 46.2525 98.49 46.41 98.49C46.515 98.805 46.62 99.75 46.6725 100.432C46.9875 102.952 47.46 107.152 51.24 109.252C52.5 109.987 53.8125 110.25 55.0725 110.25C57.33 110.25 59.43 109.357 61.005 108.727C61.6875 108.412 62.7375 107.992 62.895 107.94C63.2625 107.992 64.3125 108.412 64.995 108.727C67.4625 109.725 71.1375 111.3 74.76 109.252C78.54 107.152 79.0125 102.952 79.3275 100.432C79.38 99.75 79.485 98.805 79.38 98.8575C79.59 98.595 80.3775 98.07 80.9025 97.7025C83.055 96.18 86.625 93.66 86.625 89.25C86.625 88.6725 86.5725 88.1475 86.4675 87.6225L115.5 70.5075V110.985Z" fill="#91172C"/><path d="M63 65.625C61.8975 65.625 60.8003 65.2785 59.8657 64.5907C56.5582 62.1337 27.5625 40.0207 27.5625 20.9422C27.5625 9.39225 36.981 4.64571e-06 48.5625 4.64571e-06C53.9277 -0.00355746 59.0918 2.04144 63 5.71725C66.9082 2.04144 72.0723 -0.00355746 77.4375 4.64571e-06C89.019 4.64571e-06 98.4375 9.39225 98.4375 20.937C98.4375 40.0155 69.4417 62.1285 66.1343 64.5855C65.2285 65.2601 64.1294 65.6246 63 65.625Z" fill="#91172C"/></g><defs><clipPath id="clip0_2181_8926"><rect width="126" height="126" fill="white"/></clipPath></defs></svg>

        <div className={c.text_wrapper} >
          <p className={c.title} >Подтвердите адрес электронной почты</p>
          <p className={c.text} >Остался последний шаг! Мы отправили вам письмо с подтверждающей ссылкой на <span>{email}</span>.</p>
          <p className={c.text} >Перейдите по ней, чтобы активировать ваш аккаунт. Если письмо не пришло, проверьте папку «Спам» или запросите повторную отправку.</p>
        </div>

        <div className={c.btns}>
          <Button onClick={resendEmailConfirmation} >Отправить ссылку ещё раз</Button>
          <Button onClick={cancelHandler} >Назад</Button>
        </div>
      </div>

    </div>
  )
}

export { ConfirmEmailModal }