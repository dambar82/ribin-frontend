import { useState, useRef, useEffect } from 'react';
import {useDropzone} from 'react-dropzone';

import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'

import DatePicker from "react-datepicker";

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru'

import styles from "./CreateEventPage.module.scss"
import "react-datepicker/dist/react-datepicker.css"
import "./index.css"

import imageDnD from "../../images/svg/image-dnd.svg"
import clockIcon from "../../images/svg/clock.svg"
import buttonArrowIcon from "../../images/svg/button_arrow.svg"

const TimePicker = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [hours, setHours] = useState("16")
    const [minutes, setMinutes] = useState('00')
    const [timeValue, setTimeValue] = useState("00:00")
    
    const convertValue = (value) => {
        return value <= 9 ? `0${value}` : `${value}`
    }

    const ButtonArrow = () => (
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )

    const handlePopupClick = (e) => {
        if (!e.target.closest("[class*='popup__content']")) {
            setOpenPopup(false)
        }
    }

    const submitPopup = () => {
        setTimeValue(`${hours}:${minutes}`)
        setOpenPopup(false)
    }

    const handleChange = (e) => {
        const max = parseInt(e.target.getAttribute("max"))
        const min = parseInt(e.target.getAttribute("min"))
        const value = parseInt(e.target.value)
        const name = e.target.getAttribute("name")
        
        let result = null;

        if (value < min) {
            result = min
        } else if (value > 99) {
            result = value % 10
        }else if (value > max) {
            result = max
        } else {
            result = value
        }
        
        if (name === "hours") {
            setHours(convertValue(result))
        } else {
            setMinutes(convertValue(result))
        }
    }

    const handleButtonClick = (e) => {
        const input = e.currentTarget.parentElement.querySelector("input");
        const value = input.value;
        const max = parseInt(input.getAttribute("max"))
        const min = parseInt(input.getAttribute("min"))
        const dir = e.currentTarget.dataset.dir
        const name = input.getAttribute("name")

        if ((dir === "up" && value >= max) || (dir === "down" && value <= min)) {
            e.currentTarget.disabled = true
            return
        }

        e.currentTarget.disabled && (e.currentTarget.disabled = false)

        if (name === "hours") {
            setHours(prevState => dir === "up" ? convertValue(parseInt(prevState) + 1) : convertValue(parseInt(prevState) - 1))
        } else {
            setMinutes(prevState => dir === "up" ? convertValue(parseInt(prevState) + 1) : convertValue(parseInt(prevState) - 1))
        }
    }

    return (
        <>
            { openPopup 
              ?
                <div className={`popup ${styles.popup}`} onClick={handlePopupClick}>
                    <div className={`popup__container ${styles.popup__container}`}>
                        <div className={`popup__content ${styles.popup__content}`}>
                            <div className={styles.popup__title}>Выберите время</div>
                            <div className={styles.popup__body}>
                                <div className={styles.time}>
                                    <div className={styles.timeControl}>
                                        <button 
                                            className={styles.timeControl__up} 
                                            onClick={handleButtonClick} 
                                            type="button" 
                                            data-dir="up"
                                            disabled={hours === "23"}
                                        ><ButtonArrow /></button>
                                        <input 
                                            className={styles.timeControl__input} 
                                            type="number" min={0} max={23} 
                                            name="hours"
                                            value={hours} 
                                            onChange={handleChange}
                                        />
                                        <button 
                                            className={styles.timeControl__down} 
                                            onClick={handleButtonClick} 
                                            type="button" data-dir="down"
                                            disabled={hours === "00"}
                                        ><ButtonArrow /></button>
                                    </div>
                                    <div className={styles.time__separator}>
                                        <svg width="8" height="28" viewBox="0 0 8 28" fill="none">
                                            <circle cx="4" cy="4" r="4" fill="currentColor" />
                                            <circle cx="4" cy="24" r="4" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className={styles.timeControl}>
                                        <button 
                                            className={styles.timeControl__up} 
                                            onClick={handleButtonClick} type="button" 
                                            data-dir="up"
                                            disabled={minutes === "59"}
                                        ><ButtonArrow /></button>
                                        <input 
                                            className={styles.timeControl__input} 
                                            type="number" 
                                            min={0} 
                                            max={59} 
                                            name="minutes"
                                            value={minutes} 
                                            onChange={handleChange}
                                        />
                                        <button 
                                            className={styles.timeControl__down} 
                                            onClick={handleButtonClick} 
                                            type="button" 
                                            data-dir="down"
                                            disabled={minutes === "00"}
                                        ><ButtonArrow /></button>
                                    </div>
                                </div>
                                <button className="button button--main" onClick={submitPopup} type="button">
                                    <span>Выбрать</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              : null
            }
            <input style={{ display: "none" }} type="time" value={timeValue} />
            <div
                onClick={() => setOpenPopup(true)}
                className={styles.timeInput}
            >
                <img src={clockIcon} alt=""/>
                <span>ЧЧ/ММ</span>
            </div>
        </>
    )
}

const CreateEventPage = () => {
    const [files, setFiles] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const dataPickerEl = useRef(null)
    const {getRootProps, getInputProps, open, acceptedFiles, isDragActive} = useDropzone({
      // Disable click and keydown behavior
      noClick: true,
      noKeyboard: true,
      onDrop: acceptedFiles => {
          setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
      })))},
      accept: {
          'image/*': []
        },
    });
    const [openPopup, setOpenPopup] = useState(false)
    const [switchState, setSwitchState] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setOpenPopup(true)
    }

    const handlePopupClick = (e) => {
        if (!e.target.closest("[class*='popup__content']")) {
            setOpenPopup(false)
        }
    }

    let skeleton = [];
    for (let i = 0; i < 8 - files.length; i++) {
        skeleton.push(i + 1)
    }

    useEffect(() => {
        if (openPopup) {
            document.body.classList.add("_lock")
        } else {
            document.body.classList.remove("_lock")
        }
    }, [openPopup])

    return (
        <div className="page">
            <h1 className="page__title">Мероприятие клуба</h1>
            <div className="page__content">
                <form action="#" method="POST" className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.form__body}>
                        <div className="container">
                            <div {...getRootProps({
                                    className: 'dropzone', 
                                    style: {
                                        border: "4px dashed #48903A", 
                                        borderRadius: "35px", 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        justifyContent: "center", 
                                        alignItems: "center", 
                                        margin: "0 0 50px",
                                        padding: "77px", 
                                        height: "414px",
                                        opacity: isDragActive ? 0.5 : 1
                                    } 
                            })}>
                                <input {...getInputProps()} />
                                <img src={imageDnD} alt="" style={{margin: "0 0 20px"}}/>
                                <div style={{
                                    fontSize: "20px",
                                    fontWeight: 500,
                                    lineHeight: "calc(24 / 20)",
                                    margin: "0 0 32px",
                                    maxWidth: "330px",
                                    textAlign: "center"
                                }}>{!isDragActive ? "Выберите файл для обложки или перетащите его сюда" : "Перетащите файл(-ы) сюда..."}</div>
                                <button className="button button--green" type="button" onClick={open}><span>Выбрать файл(-ы)</span></button>
                            </div>
                        </div>
                        <div className={styles.preview}>
                            <h2 className={styles.preview__title}>Фотографии</h2>
                            <div className={styles.preview__row}>
                                {
                                files.length
                                ?
                                 files.map(thumb => (
                                    <div key={thumb.preview} className={styles.preview__thumb}>
                                        <img
                                            src={thumb.preview}
                                            onLoad={() => { URL.revokeObjectURL(thumb.preview) }}
                                        />
                                    </div>
                                 ))
                                : null
                                }
                                {skeleton.map((item, index) => (
                                    <div key={item + index} className={styles.preview__skeleton}></div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.grid}> 
                            <div className={styles.formControl}>
                                <div className={styles.formControl__label}>Название мероприятия</div>
                                <input className={styles.formControl__field} type="text" placeholder="Введите название вашего мероприятия"/>
                            </div>
                            <div className={styles.formControl}>
                                <div className={styles.formControl__label}>Дата и время</div>
                                <div className={styles.formControl__innerBody}>
                                    <DatePicker 
                                        showIcon
                                        showPopperArrow={false}
                                        selected={startDate} 
                                        minDate={new Date()}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="dd.MM.YYYY HH:MM"
                                        placeholderText='ММ/ДД/ГГ'
                                        withPortal
                                        shouldCloseOnSelect={false}
                                        className={styles.formControl__field}
                                        ref={dataPickerEl}
                                        showTimeInput
                                        timeInputLabel='Время'
                                        
                                    >
                                        <button className='button button--main' type="button" onClick={() => dataPickerEl.current?.setOpen(false)}><span>Выбрать</span></button>
                                    </DatePicker>
                                    <TimePicker />
                                </div>
                            </div>
                            <div className={styles.formControl}>
                                <div className={styles.formControl__label}>Описание мероприятия</div>
                                <textarea className={styles.formControl__field} name="" id="" placeholder="Укажите цель мероприятия, программу, ключевых спикеров или любую другую важную информацию"></textarea>
                            </div>
                            <div className={styles.formControl}>
                                <div className={styles.formControl__labelWrapper}>
                                    <div className={styles.formControl__label}>Место проведения</div>
                                    <div className={styles.formControl__switch}>
                                        <div className={styles.formControl__switchText}>На карте</div>
                                        <div
                                            className={
                                                switchState === false 
                                                ? styles.formControl__switchElement 
                                                : `${styles.formControl__switchElement} ${styles.formControl__switchElement_on}`
                                            } 
                                            onClick={() => setSwitchState(prevState => !prevState)}></div>
                                    </div>
                                </div>
                                {
                                    switchState 
                                    ? (
                                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                                            <Marker position={[51.505, -0.09]}>
                                                <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
                                            </Marker>
                                        </MapContainer>
                                    )
                                    : <textarea className={styles.formControl__field} name="" id="" placeholder="Укажите город и полный адрес проведения мероприятия"></textarea>
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className={styles.form__footer}>
                        <button className='button button--main' type="submit" onSubmit={handleSubmit}>
                            <span>Создать мероприятие</span>    
                        </button>
                    </div>
                </form>
            </div>
            {
                openPopup
                ? (
                <div className={`popup ${styles.successPopup}`} onClick={handlePopupClick}>
                    <div className={`popup__container`}>
                        <div className={`popup__content ${styles.successPopup__content}`}>
                            <div className={`popup__body ${styles.successPopup__body}`}>
                                <div className={styles.successPopup__info}>
                                    <div className={styles.successPopup__title}>Мероприятие успешно создано!</div>
                                    <p className={styles.successPopup__text}>Ваше мероприятие было успешно создано и добавлено в календарь клуба. Теперь участники могут видеть его и присоединяться. Поделитесь информацией о вашем мероприятии с друзьями и коллегами, чтобы привлечь больше участников. Спасибо за вашу активность и вклад в жизнь клуба "Рубин"!</p>
                                    <div className={styles.successPopup__actions}>
                                        <button className={`button button--main`} type="button">
                                            <span>Вернуться в клуб</span>
                                            <img src={buttonArrowIcon} alt="" />
                                        </button>
                                        <button className={`button button--main-outlined`} type="button">
                                            <span>Создать другое мероприятие</span>
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.sucessPopup__image}>
                                    <img src="/images/ruby-create-event.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : null
            }
        </div>
    )
}

export default CreateEventPage