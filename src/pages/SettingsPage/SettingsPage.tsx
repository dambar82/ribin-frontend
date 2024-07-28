import { useState, useRef } from "react"

import DatePicker from "react-datepicker";

import styles from "./SettingsPage.module.scss"
import "react-datepicker/dist/react-datepicker.css"

import hidePasswordIcon from "../../images/svg/hide-password.svg"
import showPasswordIcon from "../../images/svg/views.svg"

const SettingsPage = () => {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    // const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [copyPassword, setCopyPassword] = useState("")
    
    const [hidePassword, setHidePassword] = useState(true)
    const [hideCopyPassword, setHideCopyPassword] = useState(true)

    const dataPickerEl = useRef(null)

    const handleNameChange = e => setName(e.target.value)
    const handleSurnameChange = e => setSurname(e.target.value)
    const handleEmailChange = e => setEmail(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)
    const handleCopyPasswordChange = e => setCopyPassword(e.target.value)

    return (
        <div className="page">
            <div className={styles.settings}>
                <h1 className={styles.settings__title}>Персональные настройки</h1>
                <form action="#" method="POST" className="form">
                <div className="form__body">
                    <div className="form__column">
                        <div className="form-control">
                            <div className="form-control__label">Имя</div>
                            <input className="form-control__field" type="text" placeholder="Иван" autoComplete="off" value={name} onChange={handleNameChange}/>
                        </div>
                        <div className="form-control">
                            <div className="form-control__label">Фамилия</div>
                            <input className="form-control__field" type="text" placeholder="Иванов" autoComplete="off" value={surname} onChange={handleSurnameChange}/>
                        </div>
                        <div className="form-control">
                            <div className="form-control__label">Дата рождения</div>
                            <DatePicker 
                                showIcon
                                showPopperArrow={false}
                                selected={startDate} 
                                minDate={new Date()}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd.MM.YYYY"
                                placeholderText='ММ/ДД/ГГ'
                                withPortal
                                shouldCloseOnSelect={false}
                                className="form-control__field"
                                ref={dataPickerEl}                        
                            >
                                <button className='button button--main' type="button" onClick={() => dataPickerEl.current?.setOpen(false)}><span>Выбрать</span></button>
                            </DatePicker>
                        </div>
                    </div>
                    <div className="form__column">
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Почта</div>
                            <input className="form-control__field" type="email" placeholder="ivan@mail.ru" autoComplete="off" value={email} onChange={handleEmailChange}/>
                        </div>
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Пароль</div>
                            <div className="form-control__field-wrapper">
                                <input className="form-control__field" type={hidePassword ? "password" : "text"} placeholder="Введите пароль" autoComplete="off" value={password} onChange={handlePasswordChange}/>
                                { password ? <img src={ hidePassword ? showPasswordIcon : hidePasswordIcon  } alt="" onClick={() => setHidePassword(state => !state)}/> : null }
                            </div>
                        </div>
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Повторите пароль</div>
                            <div className="form-control__field-wrapper">
                                <input className="form-control__field" type={hideCopyPassword ? "password" : "text"} placeholder="Повторите пароль" autoComplete="off" value={copyPassword} onChange={handleCopyPasswordChange}/>
                                {copyPassword ? <img src={ hideCopyPassword ? showPasswordIcon : hidePasswordIcon  } alt="" onClick={() => setHideCopyPassword(state => !state)}/> : null }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form__footer">
                    <button className="button button--main" type="submit">
                        <span>Сохранить изменения</span>
                    </button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage