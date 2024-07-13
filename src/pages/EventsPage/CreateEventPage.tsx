import { useState, useRef } from 'react';
import {useDropzone} from 'react-dropzone';
import DatePicker from "react-datepicker";

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru'

import styles from "./CreateEventPage.module.scss"
import "react-datepicker/dist/react-datepicker.css"
import "./index.css"

import imageDnD from "../../images/svg/image-dnd.svg"

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

    let skeleton = [];
    for (let i = 0; i < 8 - files.length; i++) {
        skeleton.push(i + 1)
    }

    return (
        <div className="page">
            <h1 className="page__title">Мероприятие клуба</h1>
            <div className="page__content">
                <form action="#" method="POST" className={styles.form}>
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
                                        dateFormat="dd.MM.YYYY"
                                        placeholderText='ММ/ДД/ГГ'
                                        withPortal
                                        shouldCloseOnSelect={false}
                                        className={styles.formControl__field}
                                        ref={dataPickerEl}
                                        
                                    >
                                        <button className='button button--main' type="button" onClick={() => dataPickerEl.current?.setOpen(false)}><span>Выбрать</span></button>
                                    </DatePicker>
                                </div>
                            </div>
                            <div className={styles.formControl}>
                                <div className={styles.formControl__label}>Описание мероприятия</div>
                                <textarea className={styles.formControl__field} name="" id="" placeholder="Укажите цель мероприятия, программу, ключевых спикеров или любую другую важную информацию"></textarea>
                            </div>
                            <div className={styles.formControl}>
                                <div className={styles.formControl__label}>Место проведения</div>
                                <textarea className={styles.formControl__field} name="" id="" placeholder="Укажите город и полный адрес проведения мероприятия"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className={styles.form__footer}>
                        <button className='button button--main'>
                            <span>Создать мероприятие</span>    
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateEventPage