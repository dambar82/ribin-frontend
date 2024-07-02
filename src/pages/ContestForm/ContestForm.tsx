import React, {useCallback, useRef} from 'react';
import styles from './ContestForm.module.scss';
import {useParams} from "react-router-dom";
import cloud from '../../images/svg/cloud.svg'

const ContestForm = () => {

    const { contestId } = useParams();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        console.log(files);
    }, []);

    const onFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files);
    }, []);
    return (
        <div className={styles.contestForm}>
            <h2>
                Форма отправки работы на конкурс
            </h2>
            <form action="" className={styles.form}>
                <div className={styles.whitePart}>
                    <div className={styles.description}>
                        <div className={styles.description_inputZone}>
                            <h3>
                                Описание работы
                            </h3>
                            <textarea
                                placeholder='Поделитесь своими мыслями и чувствами по поводу работы'
                                className={styles.description_input}
                            />
                        </div>
                        <div className={styles.description_inputZone}>
                            <h3>
                                URL видео
                            </h3>
                            <input
                                placeholder='Поделитесь своими мыслями и чувствами по поводу работы'
                                className={`${styles.description_input} ${styles.description_inputLittle}`}
                            />
                        </div>
                    </div>
                    <div className={styles.filesDropzone}
                         onDrop={onFileDrop}
                         onDragOver={(event) => event.preventDefault()}
                    >
                        <div className={styles.filesDropzone_column}>
                            <div className={styles.filesDropzone_cloud}>
                                <img src={cloud} alt=""/>
                                <p>
                                    Выберите нужный файл или перетащите его сюда
                                </p>
                            </div>
                            <input type="file" multiple
                                   style={{ display: 'none' }}
                                   onChange={onFileSelect}
                                   ref={fileInputRef} />
                            <div className='green_button'
                                 onClick={() => fileInputRef.current?.click()}>
                                Выбрать файл(-ы)
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.grayPart}>
                    <button className='action_button'>
                        Отправить работу
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContestForm;