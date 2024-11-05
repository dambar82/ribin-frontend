import React, {useState} from 'react';
import {loginUser, restorePassword} from "../../store/userSlice";
import {useAppDispatch} from "../../store/hooks";
import { useNavigate, useParams } from 'react-router-dom'

import c from './auth.module.scss'

const Restore = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const params = useParams()
    console.log(params)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(password === confirmPassword) {
          dispatch(restorePassword({ req: {
              password,
              password_confirmation: confirmPassword
            },
            token: params.token
          }))
            .then((action) => {
              console.log(action.payload);
              
              if ( action.payload.status === 'error' ) {
                setError(action.payload.message)
                return
              }
              setError('')
              navigate('/login')
            })
        } else {
            // Обработка случая, когда пароли не совпадают
            alert('Пароли не совпадают!');
        }
    };

    return (
        <div className={`authBlock__restore gap-26 ${c.restore_password}`} style={{ position: 'relative' }} >
            {error && <span style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translate(-50%, 0)', color: 'red', fontSize: '24px' }} >{error}</span>}
            <div className='authBlock__restore_text'>
                <h1 className='h1_36_44'>
                    Изменение пароля
                </h1>
                <p className='authBlock__paragraph'>
                    Придумайте и введите новый пароль для вашего профиля. Обеспечьте его надежность и уникальность.
                </p>
            </div>
            <form onSubmit={handleSubmit} className='authBlock__form_block  gap-46'>
                <div className='authBlock__form_inputs'>
                    <div className='authBlock__form-group'>
                        <input
                            placeholder='Новый пароль'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='authBlock__input'
                        />
                    </div>
                    <div className='authBlock__form-group'>
                        <input
                            placeholder='Подтвердите пароль'
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className='authBlock__input'
                        />
                    </div>
                </div>
                <button type="submit" className='action_button'>Подтвердить изменения</button>
            </form>
        </div>
    );
};

export default Restore;