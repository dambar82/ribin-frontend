import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { classNames } from "../../shared/utils"

import DatePicker from "react-datepicker";

import styles from "./SettingsPage.module.scss"
import "react-datepicker/dist/react-datepicker.css"

import hidePasswordIcon from "../../images/svg/hide-password.svg"
import showPasswordIcon from "../../images/svg/views.svg"
import { editUser } from "../../store/userSlice"

const SettingsPage = () => {

    const { user } = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState(user.name || '')
    const [surname, setSurname] = useState(user.surname || '')
    const [email, setEmail] = useState(user.email || '')
    const [startDate, setStartDate] = useState<Date | null>(user.age ? new Date(user.age) : null)
    const [password, setPassword] = useState('')
    const [copyPassword, setCopyPassword] = useState('')
    
    const [hidePassword, setHidePassword] = useState(true)
    const [hideCopyPassword, setHideCopyPassword] = useState(true)

    const dataPickerEl = useRef(null)

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
      e.preventDefault()

      if ( !password ) {
        alert('Введите пароль')
        return
      }
      if ( password !== copyPassword ) {
        alert('Пароли не совпадают')
        return
      }

      dispatch(editUser({
        id: user.id,
        name,
        surname,
        email,
        password,
        age: startDate.getTime()
      }))

    }

    return (
        <div className="page">
            <div className={styles.settings}>
                <h1 className={styles.settings__title}>Персональные настройки</h1>

                <form className="form" onSubmit={onSubmit} >

                  <div className="form__body">
                    <div className="form__column">
                        <div className="form-control">
                            <div className="form-control__label">Имя</div>
                            <input
                              className="form-control__field"
                              type="text"
                              placeholder={user.name}
                              autoComplete="off"
                              value={name}
                              onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <div className="form-control__label">Фамилия</div>
                            <input
                              className="form-control__field"
                              type="text" 
                              placeholder={user.surname}
                              autoComplete="off"
                              value={surname}
                              onChange={e => setSurname(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <div className="form-control__label">Дата рождения</div>
                            {/* @ts-ignore */}
                            <DatePicker
                              date={startDate}
                              showIcon
                              showPopperArrow={false}
                              selected={startDate}
                              //@ts-ignore
                              onChange={(date) => setStartDate(date)}
                              dateFormat="dd.MM.YYYY"
                              placeholderText='ММ/ДД/ГГ'
                              withPortal
                              shouldCloseOnSelect={false}
                              className="form-control__field"
                              ref={dataPickerEl}
                            >
                              <button
                                className={classNames('button', 'button--main', styles.confirm_button)}
                                type="button"
                                onClick={() => dataPickerEl.current?.setOpen(false)}
                              >
                                <span>Выбрать</span>
                              </button>
                            </DatePicker>
                        </div>
                    </div>
                    <div className="form__column">
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Почта</div>
                            <input
                              className="form-control__field"
                              type="email"
                              placeholder={user.email}
                              autoComplete="off"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Пароль</div>
                            <div className="form-control__field-wrapper">
                                <input
                                  className="form-control__field"
                                  type={hidePassword ? "password" : "text"}
                                  placeholder="Введите пароль"
                                  autoComplete="off"
                                  value={password}
                                  onChange={e => setPassword(e.target.value)}
                                />
                                { password ? <img src={ hidePassword ? showPasswordIcon : hidePasswordIcon  } alt="" onClick={() => setHidePassword(state => !state)}/> : null }
                            </div>
                        </div>
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Повторите пароль</div>
                            <div className="form-control__field-wrapper">
                                <input
                                  className="form-control__field"
                                  type={hideCopyPassword ? "password" : "text"}
                                  placeholder="Повторите пароль"
                                  autoComplete="off"
                                  value={copyPassword}
                                  onChange={e => setCopyPassword(e.target.value)}
                                />
                                {copyPassword ? <img src={ hideCopyPassword ? showPasswordIcon : hidePasswordIcon  } alt="" onClick={() => setHideCopyPassword(state => !state)}/> : null }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form__footer">
                    <button className={classNames('button', 'button--main', styles.confirm_button)} type="submit">
                        <span>Сохранить изменения</span>
                    </button>
                </div>
              </form>

            </div>
        </div>
    )
}

export default SettingsPage