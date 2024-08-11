import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { arrayFromTo, classNames } from "../../shared/utils"
import { editUser } from "../../store/userSlice"

import DatePicker, { DatePickerProps, ReactDatePickerCustomHeaderProps, registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { getMonth, getYear } from "date-fns"

import styles from "./SettingsPage.module.scss"
import "react-datepicker/dist/react-datepicker.css"

import hidePasswordIcon from "../../images/svg/hide-password.svg"
import showPasswordIcon from "../../images/svg/views.svg"
import { MONTHS } from "../../shared/constants"


//@ts-ignore
registerLocale('ru', ru)


const YEARS = arrayFromTo(1990, getYear(new Date()) + 1);


const SettingsPage = () => {

    const { user, status } = useSelector((state: RootState) => state.user);

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
      .then(() => {
        alert('Настройки сохранены')
      })
      .catch(() => {
        alert('Что-то пошло не так')
      })

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
                            <div className={styles.datepicker_wrapper} >
                              {/* @ts-ignore */}
                              <DatePicker
                                locale='ru'
                                renderCustomHeader={(props) => <DatePickerHeader {...props} />}
                                date={startDate}
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
                              <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.83203 1.83337V5.50004" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.168 1.83337V5.50004" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.9167 3.66663H5.08333C4.07081 3.66663 3.25 4.48744 3.25 5.49996V18.3333C3.25 19.3458 4.07081 20.1666 5.08333 20.1666H17.9167C18.9292 20.1666 19.75 19.3458 19.75 18.3333V5.49996C19.75 4.48744 18.9292 3.66663 17.9167 3.66663Z" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.25 9.16663H19.75" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
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
                                { password ? <img width={20} src={ hidePassword ? hidePasswordIcon : showPasswordIcon } alt="" onClick={() => setHidePassword(state => !state)}/> : null }
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
                                {copyPassword ? <img width={20} src={ hideCopyPassword ? hidePasswordIcon : showPasswordIcon  } alt="" onClick={() => setHideCopyPassword(state => !state)}/> : null }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form__footer">
                    <button className={classNames('button', 'button--main', styles.confirm_button)} type="submit">
                        {status === 'loading'
                          ? <span>Загрузка...</span>
                          : <span>Сохранить изменения</span>
                        }
                    </button>
                </div>
              </form>

            </div>
        </div>
    )
}


const DatePickerHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => {

  const [active, setActive] = useState(false)

  return (
    <div className={styles.datepicker_header} >
      <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {"<"}
      </button>

      <p onClick={() => setActive(true)} >{MONTHS[getMonth(date)]} {getYear(date)}</p>

      {active && 
        <div className={styles.select_wrapper} >
          <select
            value={MONTHS[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(MONTHS.indexOf(value))
            }
          >
            {MONTHS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(+value)}
          >
            {YEARS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type='button' onClick={() => setActive(false)} ></button>
        </div>
      }

      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {">"}
      </button>
    </div>
  )
}

export default SettingsPage