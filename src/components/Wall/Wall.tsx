import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import styles from './Wall.module.scss';

import loupeIcon from '../../images/svg/loupe.svg'
import attachmentIcon from '../../images/svg/attachment.svg'
import deletePic from '../../images/svg/deletePic.svg'
import attachPic from '../../images/svg/attachPic.svg';
import attachVideo from '../../images/svg/attachVideo.svg';

import Select from 'react-select';

import {addPost, createPost, createPostInClub, IPost, PostAnswer} from "../../store/postSlice";
import Post from '../Post/Post';
import {Button} from '../../shared/UI'
import {useAppDispatch} from "../../store/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {fetchPeople} from "../../store/peopleSlice";
import {Link, useNavigate} from "react-router-dom";
import { getMostActiveUsers } from '../../shared/utils'
import axios from "axios";
import NotificationPost from "../Notification/NotificationPost";


interface IWall {
    posts: PostAnswer;
    type: string;
    editable?: boolean;
    clubId?: number;
    joined?: boolean;
}

interface IUser {
    avatar?: string;
    name: string;
    surname: string;
    level: number
}

let token;

try {
    const storedToken = localStorage.getItem('token');
    token = JSON.parse(storedToken);

    // Проверка, если токена нет, просто присваиваем его значение null
    if (storedToken === null) {
        token = null; // Токен отсутствует
    }
} catch (error) {
    console.error('Ошибка при получении токена:', error);
}

const MAX_COUNT_FILES_IN_FORM = 8


const User = ({avatar, name, surname, level}: IUser) => {
    return (
        <div className={styles.user}>
            <div className={styles.user__avatar}>
                { avatar && <img src={avatar} alt="" /> }
            </div>
            <div className={styles.user__name}>{name} {surname}</div>
            <div className={styles.user__level}>
                <span>Рубиков</span><span>{level}</span>
            </div>
        </div>
    )
}

const sortPosts = (posts: IPost[], sortType: number) => {
    switch (sortType) {
        case 0: // "Популярное"
            return [...posts].sort((a, b) => b.likes_count - a.likes_count);
        case 1: // "Новое"
            return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        case 2: // "Старое"
            return [...posts].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        default:
            return posts;
    }
}

const Wall = ({type, posts, editable = true, clubId, joined}: IWall) => {
    const optionsMap = {
        'public': { value: 'public', label: 'Опубликовать для всех' },
        'private': { value: 'private', label: 'Опубликовать для друзей' },
    }

    const options = Object.values(optionsMap);

    const dispatch = useAppDispatch();
    const { people, status } = useSelector((state: RootState) => state.people)
    const [feedType, setFeedType] = useState(0)
    const [sortType, setSortType] = useState(1)
    const [textareaValue, setTextareaValue] = useState('');
    const [files, setFiles] = useState<{ id: number, file: File }[]>([])
    const [videos, setVideos] = useState([]);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [option, setOption] = useState(optionsMap.public)
    const [searchTerm, setSearchTerm] = useState('')
    const [videoLink, setVideoLink] = useState('');
    const [symbols, setSymbols] = useState(false);
    const [incorrectWords, setIncorrectWords] = useState(false);
    const [samePost, setSamePost] = useState(false);
    const textareaRef = useRef(null);
    const [isValid, setIsValid] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const formRef = useRef(null);
    const [notification, setNotification] = useState({visible: false, data: null});
    const [autoCloseTimeout, setAutoCloseTimeout] = React.useState<NodeJS.Timeout | null>(null);
    const [loadedPosts, setLoadedPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const postsPerPage = 15;
    const pageRef = useRef(1);

    useEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [textareaValue, textareaRef]);

    useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    useEffect(() => {
        loadMorePosts();
    }, [posts]);

    const filteredPosts = (posts: IPost[]) => {
        return posts.filter(post => {
            if (!searchTerm) {
                return true;
            }
            return post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const filteredSortedPosts = useMemo(() => {
        return sortPosts(filteredPosts(posts.all), sortType);
    }, [posts.all, searchTerm, sortType]);

    const loadMorePosts = () => {
        const nextPagePosts = filteredSortedPosts.slice((pageRef.current - 1) * postsPerPage, pageRef.current * postsPerPage);
        if (nextPagePosts.length > 0) {
            setLoadedPosts((prev) => [...prev, ...nextPagePosts]);
            pageRef.current += 1;
        } else {
            setHasMore(false);
        }
    };

    useEffect(() => {
        setLoadedPosts([]); // Очищаем загруженные посты
        pageRef.current = 1; // Начинаем с первой страницы
        setHasMore(true);
        loadMorePosts(); // Загружаем новые данные
    }, [searchTerm, sortType]);

    const lastPostRef = useCallback((node) => {
        if (observer.current) { // @ts-ignore
            observer.current.disconnect();
        }
        // @ts-ignore
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMorePosts();
            }
        });
        if (node) { // @ts-ignore
            observer.current.observe(node);
        }
    }, [hasMore]);


    const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const file = e.target.files[0]
        if ( !file ) return
        if (file.size > 100 * 1024 * 1024) {
            alert("Размер файла не должен превышать 30 MB")
            return
        }
        setFiles(prev => {
          prev.push({
            id: Date.now(),
            file
          })
          return [...prev]
        })
    }

    const validateVideoLink = (link) => {
     //   if (link.trim() === '') return true;
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|ok\.ru|vk\.com|rutube\.ru)\/.+/;
        return videoPattern.test(link);
    };

    const handleVideoLinkChange = (event) => {
        const value = event.target.value;
        setVideoLink(value);

        const isValidLink = validateVideoLink(value);
        setIsValid(isValidLink);

        if (isValidLink) {
            setVideos((prevVideos) => [...prevVideos, value]);
            setIsInputVisible(false);
            setVideoLink('');
        }
    }

    const removeVideo = (index) => {
        const updatedVideos = videos.filter((_, i) => i !== index);
        setVideos(updatedVideos);
    };

    const changeVisible = () => {
        if (isInputVisible) {
            setIsInputVisible(false);
            setIsValid(true);
            setVideoLink('');
        } else {
            setIsInputVisible(true);
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSetNotification = (response) => {
        setNotification({visible: true, data: response})
        setTimeout(() => {
            setNotification({ visible: false, data: response });
        }, 8000);
    }

    const handleCloseNotification = () => {
        setNotification({visible: false, data: null})
    }

    const handleNotificationMouseEnter = () => {
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
            setAutoCloseTimeout(null); // Очищаем таймер
        }
    };

    // Возобновляем таймер при уходе курсора
    const handleNotificationMouseLeave = () => {
        const timeout = setTimeout(() => {
            setNotification({ visible: false, data: null });
        }, 5000); // Возобновляем таймер на 2 секунды
        setAutoCloseTimeout(timeout);
    };

    const deleteFile = ( fileId: number ) => {
      setFiles(prev => prev.filter(el => el.id !== fileId))
    }

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
      e.preventDefault()
        if (user.user) {
            if (!window.FormData) {
                alert("Ваш браузер не поддерживает отправку файлов.");
                return
            }

            if (textareaValue.length > 60) {
                if (!isValid) return;
                const form = e.currentTarget;
                const formData = new FormData(form);

                formData.append('description', formData.get('description') + videos.join(' ') as string);
                // formData.append('title', formData.get('description') as string);

                files.forEach(file => {
                    formData.append('source[]', file.file);
                });


                try {
                    if (type !== 'club') {
                        const newPost = await dispatch(createPost(formData)).unwrap();
                        console.log('new post', newPost);
                        if (newPost === 'Вы используете не допустимые слова. Измените текст и повторите попытку.') {
                            setIncorrectWords(true);
                            setTimeout(() => {
                                setIncorrectWords(false);
                            }, 2000)
                            return
                        } else if (newPost === 'Данный пост был опубликован ранее.') {
                            console.log('we here')
                            setSamePost(true);
                            setTimeout(() => {
                                setSamePost(false);
                            }, 2000)
                            return
                        } else {
                            dispatch(addPost(newPost));

                            const response = await axios.get(`https://api-rubin.multfilm.tatar/api/messages/rubick_notification/more`, {headers: {Authorization: `Bearer ${token}`}});
                            if (response.data) {
                                setNotification({visible: true, data: response.data})
                                setTimeout(() => {
                                    setNotification({visible: false, data: response.data});
                                }, 8000);
                            }
                        }
                    } else {
                        const newPost = await dispatch(createPostInClub({clubId, formData})).unwrap();
                        // @ts-ignore
                        if (newPost !== 'Вы используете не допустимые слова. Измените текст и повторите попытку.') {
                            // @ts-ignore
                            dispatch(addPost(newPost));

                            const response = await axios.get(`https://api-rubin.multfilm.tatar/api/messages/rubick_notification/more`, {headers: {Authorization: `Bearer ${token}`}});
                            if (response.data) {
                                setNotification({visible: true, data: response.data})
                                setTimeout(() => {
                                    setNotification({ visible: false, data: response.data });
                                }, 8000);
                            }

                        } else {
                            setIncorrectWords(true);
                            setTimeout(() => {
                                setIncorrectWords(false);
                            }, 2000)
                            return
                        }
                    }
                    setFiles([]);
                    setVideos([]);
                    setTextareaValue('');
                } catch (error) {
                    console.error('Ошибка при создании поста:', error);
                }
            } else {
                if (textareaValue.length > 0) {
                    setSymbols(true);
                    setTimeout(() => {
                        setSymbols(false);
                    }, 2000)
                }
            }
        } else {
            navigate('/login');
        }
    }

    return (
        <div className={styles.wall}>
            <nav className={styles.wall__nav}>
                {["Записи"].map((item, index) => (
                    <button
                        key={item + index}
                        className={feedType !== index ? styles.wall__navButton : `${styles.wall__navButton} ${styles.wall__navButtonActive}`}
                        type="button"
                        onClick={() => setFeedType(index)}
                    >
                        <span>{item}</span>
                    </button>
                ))}
            </nav>
            <div className={styles.wall__content}>
                {feedType === 0 && (
                    <div className={styles.wall__feed}>
                        { (type === 'club' && !joined || user.user === null) ? null :
                            <form className={styles.wall__feedForm} onSubmit={onSubmit} ref={formRef}>
                                <div className={styles.textarea_wrapper} >
                                  <textarea
                                      name="description"
                                      id=""
                                      placeholder="Поделитесь с другими своими успехами и новостями!"
                                      value={textareaValue}
                                      onChange={(e) => setTextareaValue(e.target.value)}
                                      ref={textareaRef}
                                  >
                                  </textarea>
                                    <div className={styles.textarea_wrapper_low}>
                                            <div className={`${styles.wall__feedFormFileField} ${files.length <= MAX_COUNT_FILES_IN_FORM && textareaValue.length > 0 ? styles.show : ''}`}
                                                 onClick={() => fileInputRef.current?.click()}
                                                 title='Прикрепить картинку'
                                            >
                                                <input type='file' id='file' accept='image/*,'
                                                       ref={fileInputRef}
                                                       onChange={handleFileChange}/>
                                                <label htmlFor='file'>
                                                    <img src={attachPic} alt=''/>
                                                </label>
                                            </div>
                                            <div
                                                className={`${styles.wall__feedFormFileField} ${textareaValue.length > 0 ? styles.show : ''}`}
                                                onClick={changeVisible}
                                                title='Прикрепить видео'
                                            >
                                                <label>
                                                    <img src={attachVideo} alt=""/>
                                                </label>
                                            </div>
                                        {
                                            textareaValue.length > 0 && isInputVisible && (
                                                <div className={styles.videoAttachment}>
                                                    <h2>
                                                        URL видео
                                                    </h2>
                                                    <input type="text"
                                                           value={videoLink}
                                                           onChange={handleVideoLinkChange}
                                                           placeholder='Введите ссылку на видео с YouTube, VK, Однокласники или Rutube'/>
                                                    {!isValid && <p style={{ color: 'red' }}>Пожалуйста, введите корректную ссылку на видео.</p>}
                                                </div>
                                            )
                                        }
                                        {/*}*/}
                                        {
                                            symbols && (
                                                <div className={`${styles.symbols_message} ${symbols ? styles.show : ''}`}>
                                                    Недостаточно символов для отправки сообщения
                                                </div>
                                            )
                                        }
                                        {
                                            (incorrectWords || samePost) && (
                                                <div className={`${styles.symbols_message} ${(incorrectWords || samePost) ? styles.show : ''}`}>
                                                    {incorrectWords ? 'Вы используете недопустимые слова. Измените текст и повторите попытку.' : 'Данный пост был опубликован ранее.'}
                                                </div>
                                            )
                                        }
                                        <span className={`${styles.symbol_counter} ${symbols && styles.symbol_counterRED} ${textareaValue.length < 60 && textareaValue.length > 0 ? styles.show : ''}`}>{textareaValue.length}/60</span>
                                        <Button
                                            className={`${styles.submit_button} ${textareaValue.length > 0 ? styles.show : ''}`}
                                            type="submit"
                                        >
                                            Отправить 
                                        </Button>
                                        {/*)}*/}
                                    </div>
                                </div>
                                <div className={styles.wall__feedFormFile}>
                                    {files.map(file => (
                                        <div key={file.id} className={styles.wall__feedFormFileDoc}>
                                            <span>{file?.file.name}</span>
                                            <img src={deletePic} alt="" onClick={() => deleteFile(file.id)}/>
                                        </div>
                                    ))}
                                    {videos.map((video, index) => (
                                        <div key={index} className={styles.wall__feedFormFileDoc} style={{maxWidth: '100%'}} title={video}>
                                            <span>{video}</span>
                                            <img src={deletePic} alt="" onClick={() => removeVideo(index)}/>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.feenFormFooter} >
                                    <Select
                                        options={options}
                                        placeholder="Filter by Region"
                                        isClearable={false}
                                        isSearchable={false}
                                        value={option}
                                        onChange={(option) => setOption(option)}
                                        className={styles.form_select}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                border: "none",
                                                // boxShadow: "none",
                                                fontFamily: '"Saira", "sans-serif"',
                                                fontSize: "20px",
                                                fontWeight: "500",
                                                lineHeight: "calc(24 / 20)"
                                            }),
                                            indicatorSeparator: () => ({
                                                display: "none"
                                            })
                                        }}
                                    />
                                </div>
                            </form>
                        }
                        {loadedPosts.length ? loadedPosts.map((post, index) => (
                            <div key={post.id} ref={index === loadedPosts.length - 1 ? lastPostRef : null}>
                            <Post
                               // key={post.id}
                                id={post.id}
                                name={post.client.name}
                                surname={post.client.surname}
                                avatar={post.client.avatar}
                                created_by={post.client.id}
                                videos={videos}
                                tags={null}
                                source={post.source}
                                verified={post.client.verified}
                                comments={post.comments}
                                likes={post.likes_count}
                                liked_by={post.liked_by}
                                updated_at={post.created_at}
                                title={post.description}
                                type={'all'}
                                handleSetNotification={handleSetNotification}
                            >
                            </Post>
                            </div>
                        )) : null}
                    </div>
                )}
                {feedType === 1 && (
                    <p>Здесь должны быть комментарии</p>
                )}
            </div>
            <aside className={ type === "post" || type === "club" || type ==="profile" ? styles.wall__aside : `${styles.wall__aside} ${styles.wall__aside_sticky}`}>
                <div className={styles.wall__asideBlock}>
                    <form action="#" className={styles.wall__form}>
                        <button type="button">
                            <img src={loupeIcon} alt="" />
                        </button>
                        <input
                            type="text"
                            placeholder='Поиск'
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </form>
                    <div className={styles.wall__filter}>
                        {["Популярное", "Новое", "Старое"].map((item, index) => (
                            <button
                                key={item + index}
                                className={sortType === index ? `${styles.wall__filterItem} ${styles.wall__filterItemActive}` : styles.wall__filterItem}
                                type="button"
                                onClick={() => setSortType(index)}
                            >{item}</button>
                        ))}
                    </div>
                </div>
                { type === "post" ?
                    <div className={styles.wall__asideBlock}>
                        <div className={styles.wall__users}>
                            <div className={styles.wall__usersTitle}>Активные пользователи</div>
                            <ul className={styles.wall__usersList}>

                                {getMostActiveUsers(people, 5).map((user, index) => (
                                    <li key={user.name + index}>
                                        <Link to={`/user/${user.id}`}>
                                            <User
                                                avatar={user.avatar}
                                                name={user.name}
                                                surname={user.surname}
                                                level={user.rubick}
                                            />
                                        </Link>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div> : null
                }
            </aside>
            {notification.visible && (
                <NotificationPost data={notification.data} onMouseLeave={handleNotificationMouseLeave} onMouseEnter={handleNotificationMouseEnter} onClose={handleCloseNotification}/>
            )}
        </div>
    )
}

export default Wall
