import React, {useState, useRef, useEffect} from "react"
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
import { TEditUserRequest } from "../../shared/types/user.types"
import axios from "axios";


//@ts-ignore
registerLocale('ru', ru)


const YEARS = arrayFromTo(1990, getYear(new Date()) + 1);



const SettingsPage = () => {

    const { user, status } = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [school, setSchool] = useState('')
    const [schoolNumber, setSchoolNumber] = useState('')
    const [startDate, setStartDate] = useState<Date | null>(user.birthdate ? new Date(user.birthdate) : null)
    const [password, setPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [districtOptions, setDistrictOptions] = useState(null);
    const [district, setDistrict] = useState(user.district ? user.district.id : 0);
    const [hidePassword, setHidePassword] = useState(true)
    const [hideCopyPassword, setHideCopyPassword] = useState(true)

    const dataPickerEl = useRef(null)

    useEffect(() => {
        const fetchDistricts = async () => {
            const response = await axios.get('https://api-rubin.multfilm.tatar/api/districts');
            setDistrictOptions([{id: 0, title: 'Не указан'}, ...response.data]);
        }
        fetchDistricts();
    }, [])

    const handleDeleteClick = () => {
        const confirmed = window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.');
        if (confirmed) {
            deleteUser();
        }
    };

    const deleteUser = async () => {
        try {
            const $api = axios.create({
                baseURL: 'https://api-rubin.multfilm.tatar'
            });

            $api.interceptors.request.use(config => {
                const token = JSON.parse(localStorage.getItem('token') || '0');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            });

            const res = await $api.delete(`/api/clients/${user.id}`);

            // Проверка успешности удаления
            if (res.status === 200 || res.status === 204) {
                // Очистка localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');

                // Перенаправление на главную страницу
                window.location.href = '/';
            } else {
                console.error('Ошибка при удалении пользователя');
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };


    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
      e.preventDefault()

      const data = new FormData(e.currentTarget)

      const formDistrict = +(data.get('district') as string | null)

      const req: TEditUserRequest = {
        id: user.id,
        birthdate: startDate?.getTime() || null,
        districts_id: formDistrict === 0 ? null : formDistrict
      }

      if ( name ) req.name = name
      if ( surname ) req.surname = surname
      if ( email ) req.email = email
      if ( school ) req.school = school
      if ( schoolNumber ) req.school_number = schoolNumber
      if ( password ) req.password = password
      if ( district ) req.districts_id = district

      dispatch(editUser(req))
      .then(() => {
        setSuccessMessage('Настройки сохранены')
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000);
      })
      .catch(() => {
        setErrorMessage('Что-то пошло не так')
        setTimeout(() => {
          setErrorMessage('')
        }, 3000);
      })

    }

    if (!districtOptions) {
        return <p>Загрузка...</p>
    }

    return (
        <div className="page">
            <div className={styles.settings}>
                <h1 className={styles.settings__title}>Персональные настройки</h1>

                <form className="form" onSubmit={onSubmit} >

                  {successMessage && <p className={styles.success_message} >{successMessage}</p>}
                  {errorMessage && <p className={styles.error_message} >{errorMessage}</p>}

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
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Название школы</div>
                            <input
                              className="form-control__field"
                              type="text"
                              placeholder={user.school}
                              autoComplete="off"
                              value={school}
                              onChange={e => setSchool(e.target.value)}
                            />
                        </div>
                        <div className={`${styles.form__control} form-control`}>
                            <div className="form-control__label">Номер школы</div>
                            <input
                              className="form-control__field"
                              type="number"
                              placeholder={''+(user.school_number||'')}
                              autoComplete="off"
                              value={schoolNumber}
                              onChange={e => setSchoolNumber(e.target.value)}
                            />
                        </div>
                        {districtOptions && (
                            <div className={`${styles.form__control} form-control`}>
                                <div className="form-control__label">Населенный пункт</div>
                                <select name="district" className={styles.form_select}
                                        value={district}
                                        onChange={e => {
                                            const selectedId = e.target.value;
                                            const selectedDistrict = districtOptions.find(district => district.id === selectedId);
                                            setDistrict(selectedDistrict);
                                        }}
                                        size={1} >
                                    {districtOptions.map((value, index) => (
                                        <option
                                            key={index}
                                            value={value.id}
                                        >
                                            {value.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
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
                        <button className={styles.deleteAccout} onClick={handleDeleteClick}>Удалить аккаунт</button>
                        {/* <div className={`${styles.form__control} form-control`}>
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
                        </div> */}
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
