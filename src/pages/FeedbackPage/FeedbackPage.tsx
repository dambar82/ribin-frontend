import React, {useEffect, useState} from "react"
import {useDropzone} from 'react-dropzone';
import axios from "axios";
import styles from "./FeedbackPage.module.scss"

import imageDnD from "../../images/svg/image-dnd.svg"
import cloudIcon from "../../images/svg/cloud.svg";
import deleteFileImg from "../../images/svg/deleteFile.svg";


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const token = JSON.parse(localStorage.getItem('token') || '0')

const FeedbackPage = () => {
    const [email, setEmail] = useState("")
    const [topic, setTopic] = useState("")
    const [text, setText] = useState("")
    const [errorMessage, setErrorMessage] = useState('');
    const [files, setFiles] = useState([])
    const {getRootProps, getInputProps, open, acceptedFiles, isDragActive} = useDropzone({
        // Отключаем клик и поведение клавиатуры
        noClick: true,
        noKeyboard: true,
        onDrop: acceptedFiles => {
            // Проверяем, есть ли загруженные файлы и загружаем только один
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]; // Берем только первую загруженную картинку
                setFiles([Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })]); // Заменяем старую картинку на новую
            }
        },
        accept: {
            'image/*': []
        },
    });

    const [openPopup, setOpenPopup] = useState(false)
  
    const handlePopupClick = (e) => {
        if (!e.target.closest("[class*='popup__content']")) {
            setOpenPopup(false)
            document.body.classList.remove("_lock")
        }
    }

    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (email && topic && text) {
            if (email) formData.append('email', email);
            if (topic) formData.append('subject', topic);
            if (text) formData.append('message', text);
            if (files.length === 1) formData.append('image', files[0]);

            const response = await axios.post('https://dnevnik-api.rubin-kazan.ru/api/clients/feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log(response);

            e.target.reset()
            setOpenPopup(true)
            document.body.classList.add("_lock")
        } else {
            setErrorMessage('Не все поля заполнены')
            return
        }
    }

    const deleteFile = ( fileId: string ) => {
        setFiles(prev => prev.filter(el => el.id !== fileId))
    }

    useEffect(() => {
        console.log(files);
    }, [files])

    const handleEmailChange = (e) => setEmail(e.target.value)
    const handleTopicChange = (e) => setTopic(e.target.value)
    const handleTextChange = (e) => setText(e.target.value)

    return (
        <div className="page">
            <div className={styles.feedback}>
                <h1 className={styles.feedback__title}>Обратная связь</h1>
                <form className="form" action="#" method="post" onSubmit={handleSubmit}>
                    <div className={`${styles.form__body} form__body`}>
                        <div>
                            <div className="form-control">
                                <div className="form-control__label">Почта</div>
                                <input className="form-control__field" type="email" placeholder="Введите ваш действующий email адрес" autoComplete="off" value={email} onChange={handleEmailChange}/>
                            </div>
                            <div className="form-control">
                                <div className="form-control__label">Тема сообщения</div>
                                <input className="form-control__field" type="text" placeholder="Укажите краткую тему вашего сообщения" autoComplete="off" value={topic} onChange={handleTopicChange}/>
                            </div>
                            <div className="form-control">
                                <div className="form-control__label">Сообщение</div>
                                <textarea className="form-control__field" name="" id="" placeholder="Пожалуйста, опишите вашу проблему, вопрос или предложение" autoComplete="off" value={text} onChange={handleTextChange}></textarea>
                            </div>
                        </div>
                        <div>
                            <div {...getRootProps({
                                className: 'dropzone',
                                style: {
                                    border: "4px dashed #48903A",
                                    borderRadius: "35px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "stretch",
                                    gridColumn: "2 / 3",
                                    gridRow: "1 / 4",
                                    padding: "77px",
                                    minHeight: "414px",
                                    opacity: isDragActive ? 0.5 : 1
                                }
                            })}>
                                <input {...getInputProps()} />
                                <img src={cloudIcon} alt="" style={{margin: "0 0 20px"}}/>
                                <div style={{
                                    fontSize: "20px",
                                    fontWeight: 500,
                                    lineHeight: "calc(24 / 20)",
                                    margin: "0 0 32px",
                                    maxWidth: "330px",
                                    textAlign: "center"
                                }}>{!isDragActive ? "Выберите нужный файл или перетащите его сюда" : "Перетащите файл(-ы) сюда..."}</div>
                                <button className="button button--green" type="button" onClick={open}><span>Выбрать файл(-ы)</span></button>
                            </div>
                            <div className={styles.choosed_files_wrapper} >
                                {files.map(file => (
                                    <div className={styles.fileBlock} key={file.id} >
                                        <span>{file.name}</span>
                                        <img src={deleteFileImg} style={{cursor: 'pointer'}} onClick={() => deleteFile(file.id)}></img>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <div className={`${styles.form__footer} form__footer`}>
                        <button className="button button--main" type="submit">
                            <span>Отправить</span>
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
                                    <div className={styles.successPopup__title}>Благодарим за обратную связь!</div>
                                    <p className={styles.successPopup__text}>Ваше сообщение успешно отправлено. Мы ценим ваше время и ваше мнение, и будем рады рассмотреть ваши вопросы или предложения. Наша команда постарается ответить вам в ближайшее время.</p>
                                    <div className={styles.successPopup__actions}>
                                        <button className={`button button--main`} type="button" onClick={handleClosePopup}>
                                            <span>Закрыть</span>
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.sucessPopup__image}>
                                    <img src="/images/ruby-create-feedback.png" alt="" />
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

export default FeedbackPage