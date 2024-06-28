import React, {useState} from 'react';
import {useAppDispatch} from "../store/hooks";
import {registerUser} from "../store/userSlice";

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser({ email, password, name, surname }));
    };

    return (
        <div className='authBlock'>
            <div className='authBlock__text gap-16'>
                <h1 className='authBlock__h1'>
                    Зарегистрируйтесь и станьте частью клуба "Рубин"!
                </h1>
                <p className='authBlock__paragraph'>
                    Заполните простую форму, чтобы создать учетную запись и получить доступ ко всем возможностям нашего сайта.
                </p>
            </div>
            <div className='authBlock__form'>
                <h2 className='authBlock__h2'>
                    Регистрация
                </h2>
                <form onSubmit={handleSubmit} className='authBlock__form_block'>
                    <div className='authBlock__form_inputs'>
                        <div className='authBlock__form-group'>
                            <input
                                placeholder='Имя'
                                type="text"
                                id='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className='authBlock__input'
                            />
                        </div>
                        <div className='authBlock__form-group'>
                            <input
                                placeholder='Фамилия'
                                type="text"
                                id='surname'
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                                className='authBlock__input'
                            />
                        </div>
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
                    </div>
                    <button type="submit" className='action_button'>Войти в аккаунт</button>
                </form>
            </div>
        </div>
    );
};

export default Register;