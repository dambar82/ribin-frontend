import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from "../../store/userSlice";
import {useAppDispatch} from "../../store/hooks";
import {Link, useNavigate} from "react-router-dom";
import {RootState} from "../../store/store";
import { ConfirmEmailModal } from './components'

const Login = () => {

    const { user } = useSelector((state: RootState) => state.user);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }))
          .then(res => {
            const msg = res?.payload?.message
            if ( msg ) {
              setErrorMessage(msg)
            }
          })
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email_confirmed ) {
            navigate('/');
        }
    }, [user, navigate])

    if ( user && !user.email_confirmed ) {
      return <ConfirmEmailModal email={user?.email} />
    }

    return (
        <div className='authBlock'>
            <div className='authBlock__text gap-16'>
                <h1 className='authBlock__h1'>
                    Добро пожаловать обратно в клуб, мы скучали!
                </h1>
                <p className='authBlock__paragraph'>
                    Войдите в свой профиль, чтобы продолжить пользоваться всеми функциями сайта и получать актуальную информацию.
                </p>
            </div>
            <div className='authBlock__form'>
                <h2 className='authBlock__h2'>
                   Вход
                </h2>
                <form onSubmit={handleSubmit} className='authBlock__form_block'>
                    <div className='authBlock__form_inputs'>
                      {errorMessage && <span style={{ color: 'red' }} >{errorMessage}</span>}
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
                        <div className='authBlock__form-group'>
                            <input
                                placeholder='Пароль'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className='authBlock__input'
                            />
                        </div>
                        <Link to='/restore'>
                            <div className='authBlock__form_restore'>
                                Восстановить пароль
                            </div>
                        </Link>
                    </div>
                    <button type="submit" className='action_button'>Войти в аккаунт</button>
                </form>
            </div>
        </div>
    );
};

export default Login;