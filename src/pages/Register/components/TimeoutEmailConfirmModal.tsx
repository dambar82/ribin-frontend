import { useState } from 'react'
import { Button, Logo } from '../../../shared/UI'
import { classNames } from '../../../shared/utils'
import { isEmailValid } from '../../../shared/utils/validators/isEmailValid'

import c from './confirmEmailModal.module.scss'

const TimeoutConfirmEmailModal = () => {

  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget)

    const email = data.get('email') as string | null

    setError('')

    if ( !isEmailValid(email) ) {
      setError('Укажите свою почту*')
    }
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

          <form onSubmit={onSubmit} >
            <div className='authBlock__form-group'>
              {error && <span>{error}</span>}
              <input
                  placeholder='Почта'
                  type='text'
                  id='email'
                  name='email'
                  className={classNames(
                    'authBlock__input',
                    error ? c._invalid : ''
                  )}
              />
            </div>
            <Button>Запросить повторно</Button>
          </form>
      </div>

    </div>
  )
}

export { TimeoutConfirmEmailModal }