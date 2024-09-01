import React, {useState} from 'react';
import {loginUser, resetPassword} from "../../store/userSlice";
import {useAppDispatch} from "../../store/hooks";

import c from './auth.module.scss'

const Restore = () => {

    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(resetPassword({ email }))
          .then((action) => {
            if ( action.payload.status === 'error' ) {
              setError(action.payload.message)
              setSuccess('')
              return
            }
            setSuccess(action.payload.message)
            setError('')
          })
    };

    return (
        <div className={`authBlock__restore gap-26 ${c.restore_password}`} style={{ position: 'relative' }} >
            {error && <span style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translate(-50%, 0)', color: 'red', fontSize: '24px' }} >{error}</span>}
            {success && <span style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '24px' }} >{success}</span>}
            <div className='authBlock__restore_text'>
                <h1 className='h1_36_44'>
                    Восстановление пароля
                </h1>
                <p className='authBlock__paragraph'>
                    Укажите, пожалуйста, адрес электронной почты, который вы использовали при регистрации.
                </p>
            </div>
            <form onSubmit={handleSubmit} className='authBlock__form_block  gap-46'>
                <div className='authBlock__form_inputs'>
                    <div className='authBlock__form-group'>
                        <input
                            placeholder='Почта'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='authBlock__input'
                        />
                    </div>
                </div>
                <button type="submit" className='action_button'>Отправить запрос</button>
            </form>
        </div>
    );
};

export default Restore;