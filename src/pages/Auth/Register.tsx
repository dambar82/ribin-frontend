import React, {useState} from 'react';
import {useAppDispatch} from "../../store/hooks";
import { registerUser } from "../../store/userSlice";
import { Checkbox } from '@mui/material'
import { Link } from 'react-router-dom'
import { classNames } from '../../shared/utils'
import { ConfirmEmailModal } from './components'
import { isEmailValid } from '../../shared/utils/validators/isEmailValid'

import c from './Register.module.scss'
import c2 from './auth.module.scss'

const POLITICS_URL = process.env.REACT_APP_POLITICS_URL

type TFormFiled = { id: string, placeholder: string, type?: 'password' }

const FORM_FIELDS: TFormFiled[] = [
  { id: 'name', placeholder: 'Имя' },
  { id: 'surname', placeholder: 'Фамилия' },
  { id: 'email', placeholder: 'Почта' },
  { id: 'password', placeholder: 'Пароль', type: 'password' },
]


const Register = () => {

    const [formData, setFormData] = useState<Record<string, string>>(FORM_FIELDS.reduce((acc, el) => {
      acc[el.id] = ''
      return acc
    }, {}))
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [confirmEmail, setConfirmEmailModal] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget)

        const name = data.get('name') as string | null
        const surname = data.get('surname') as string | null
        const email = data.get('email') as string | null
        const password = data.get('password') as string | null
        const checkbox = data.get('checkbox') as string | null

        setErrors({})

        if ( !isNameValid(name) ) {
          setErrors(prev => ({ ...prev, name: 'Укажите своё имя*' }))
        }
        if ( !isSurnameValid(surname) ) {
          setErrors(prev => ({ ...prev, surname: 'Укажите свою фамилию*' }))
        }
        if ( !isEmailValid(email) ) {
          setErrors(prev => ({ ...prev, email: 'Укажите свою почту*' }))
        }
        if ( !isPasswordValid(password) ) {
          setErrors(prev => ({ ...prev, password: 'Укажите свой пароль*' }))
        }
        if ( !checkbox ) {
          setErrors(prev => ({ ...prev, checkbox: 'Согласие обязательно*' }))
        }

        dispatch(registerUser({ email, password, name, surname }))
          .then((res: any) => {
            console.log(res);
            if ( res.payload?.message ) {
              setErrorMessage(res.payload?.message)
            }
            else if ( res.payload ) {
              // @ts-ignore
              ym(98214114,'reachGoal','registration_dnevnik')
             setConfirmEmailModal(res.payload.user_id)
           }
          })
    };

    if ( confirmEmail ) {
      return <ConfirmEmailModal email={formData?.email} user_id={confirmEmail} />
    }

    return (
        <div className={classNames('authBlock', c2.auth_block)}>
            <div className='authBlock__text gap-16'>
                <h1 className='authBlock__h1'>
                    Зарегистрируйтесь и станьте частью клуба "Рубин"!
                </h1>
                <p className='authBlock__paragraph'>
                    Заполните простую форму, чтобы создать учетную запись и получить доступ ко всем возможностям нашего сайта.
                </p>
            </div>
            <div className={classNames('authBlock__form', c.authBlock__form, c2.form_wrapper)}>
                <h2 className='authBlock__h2'>
                    Регистрация
                </h2>
               {errorMessage && <p>{errorMessage}</p>}
                <form onSubmit={handleSubmit} className='authBlock__form_block'>
                    <div className='authBlock__form_inputs'>
                      {FORM_FIELDS.map(field => (
                        <div key={field.id} className='authBlock__form-group'>
                          {errors[field.id] && <span style={{ color: 'red' }} >{errors[field.id]}</span>}
                          <input
                              placeholder={field.placeholder}
                              type={field?.type || "text"}
                              id={field.id}
                              name={field.id}
                              value={formData[field.id]}
                              onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                              className={classNames(
                                'authBlock__input',
                                errors[field.id] ? c._invalid : ''
                              )}
                          />
                        </div>
                      ))}
                        <div className={c.politics} >
                          {errors.checkbox && <span className={c.checkbox_error} >{errors.checkbox}</span>}
                          <Checkbox name='checkbox' className={c.checkbox} />
                          <span>
                            Соглашаюсь на обработку моих персональных данных в соответствии с
                            <Link to='https://dnevnik.rubin-kazan.ru/page/rulez' >Политикой конфиденциальности</Link>.
                          </span>
                        </div>
                    </div>
                    <button type="submit" className={classNames('action_button', c.button)}>Создать аккаунт</button>
                </form>
            </div>
        </div>
    );
};

const isNameValid = ( value: string ) => {
  return value.length > 0
}
const isSurnameValid = ( value: string ) => {
  return value.length > 0
}

const isPasswordValid = ( value: string ) => {
  return value.length > 0
}

export default Register;