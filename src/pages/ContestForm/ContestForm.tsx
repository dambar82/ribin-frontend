import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './ContestForm.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import cloud from '../../images/svg/cloud.svg'
import {useAppDispatch} from "../../store/hooks";
import {sendWorkForContest} from "../../store/contestSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

const ContestForm = () => {

    const dispatch = useAppDispatch();
    const { contestId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    const [userId, setUserId] = useState(null)
    const [workDescription, setWorkDescription] = useState('');
    const [urlVideo, setUrlVideo] = useState('');
    const [files, setFiles] = useState<{ id: string, file: File }[]>([])
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUserId(user.id);
    }, [user])

    const onFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        files.forEach(file => {
          setFiles(prev => {
            prev.push({
              id: file.name,
              file
            })
            return [...prev]
          })
        })
        setIsDragOver(false);
    }, []);

    const onFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
          setFiles(prev => {
            prev.push({
              id: file.name,
              file
            })
            return [...prev]
          })
        })
        setErrorMessage('');
    }, [])
    
    const deleteFile = ( fileId: string ) => {
      setFiles(prev => prev.filter(el => el.id !== fileId))
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(sendWorkForContest({
                description: workDescription,
                source: files.reduce((acc, file) => {
                  acc.push(file.file)
                  return acc
                }, []),
                video: urlVideo,
                contest_id: Number(contestId),
                client_id: userId
            })).unwrap();

            navigate(`/contests/${contestId}`);

            window.location.reload();
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    }

    return (
        <div className={styles.contestForm}>
            <h2>
                Форма отправки работы на конкурс
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.whitePart}>
                    <div className={styles.description}>
                        <div className={styles.description_inputZone}>
                            <h3>
                                Описание работы
                            </h3>
                            <textarea
                                placeholder='Поделитесь своими мыслями и чувствами по поводу работы'
                                className={styles.description_input}
                                value={workDescription}
                                onChange={(e) => setWorkDescription(e.target.value)}
                            />
                        </div>
                        <div className={styles.description_inputZone}>
                            <h3>
                                URL видео
                            </h3>
                            <input
                                value={urlVideo}
                                onChange={(e) => setUrlVideo(e.target.value)}
                                placeholder='Поделитесь своими мыслями и чувствами по поводу работы'
                                className={`${styles.description_input} ${styles.description_inputLittle}`}
                            />
                        </div>
                    </div>
                    <div className={styles.dropzone_wrapper} >
                      <div className={`${styles.filesDropzone} ${isDragOver ? styles.dragOver : ''}`}
                          onDrop={onFileDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
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

                      <div className={styles.choosed_files_wrapper} >
                        {files.map(file => (
                          <div key={file.id} >
                            <span>{file.file?.name}</span>
                            <button type='button' onClick={() => deleteFile(file.id)}></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}

                </div>
                <div className={styles.grayPart}>
                    <button className='action_button' type='submit'>
                        Отправить работу
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContestForm;
