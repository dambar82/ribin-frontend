import {useEffect, useState} from 'react'
import styles from './Wall.module.scss';

import loupeIcon from '../../images/svg/loupe.svg'
import attachmentIcon from '../../images/svg/attachment.svg'

import Select from 'react-select';

import {addPost, createPost, IPost, PostAnswer} from "../../store/postSlice";
import Post from '../Post/Post';
import {Button} from '../../shared/UI'
import {useAppDispatch} from "../../store/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {fetchPeople} from "../../store/peopleSlice";
import {Link} from "react-router-dom";


interface IWall {
    posts: PostAnswer;
    type: string;
    editable?: boolean;
}

interface IUser {
    avatar?: string;
    name: string;
    surname: string;
    level: number
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
                <span>Уровень</span><span>{level}</span>
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

const Wall = ({type, posts, editable = true}: IWall) => {
    const optionsMap = {
        'public': { value: 'public', label: 'Опубликовать для всех' },
        'private': { value: 'private', label: 'Опубликовать для друзей' },
    }

    const options = Object.values(optionsMap);

    const dispatch = useAppDispatch();
    const { people, status } = useSelector((state: RootState) => state.people)
    const [feedType, setFeedType] = useState(0)
    const [sortType, setSortType] = useState(1)
    const [postType, setPostType] = useState(0)
    const [textareaValue, setTextareaValue] = useState('');
    const [files, setFiles] = useState<{ id: number, file: File }[]>([])
    const [option, setOption] = useState(optionsMap.public)
    const [searchTerm, setSearchTerm] = useState('')


    useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    const users = [
        { avatar: "/images/popular-user-01.png", name: "Амина Ушакова", level: 201 },
        { avatar: "/images/popular-user-02.png", name: "Артем Егоров", level: 180 },
        { avatar: "/images/popular-user-03.png", name: "Вера Дроздова", level: 140 },
        { avatar: "/images/popular-user-04.png", name: "Анна Емельянова", level: 135 },
        { avatar: "/images/popular-user-05.png", name: "Георгий Воробьев", level: 95 }
    ]

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

    const filteredPosts = (posts: IPost[]) => {
        return posts.filter(post => {
            if (!searchTerm) {
                return true;
            }
            return post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const sortedAllPosts = sortPosts(filteredPosts(posts.all), sortType);
    const sortedVideoPosts = sortPosts(filteredPosts(posts.video), sortType);
    const sortedImagePosts = sortPosts(filteredPosts(posts.image), sortType);

    const deleteFile = ( fileId: number ) => {
      setFiles(prev => prev.filter(el => el.id !== fileId))
    }

    useEffect(() => {
        console.log(posts);
    }, [posts])

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
      e.preventDefault()
      const form = e.currentTarget;
        const formData = new FormData(form);

        formData.append('description', formData.get('description') as string);
        formData.append('title', formData.get('description') as string);

        files.forEach(file => {
            formData.append('source[]', file.file);
        });


        try {
            const newPost = await dispatch(createPost(formData)).unwrap();
            console.log(newPost);
            dispatch(addPost(newPost));
            setFiles([]);
            setTextareaValue('');
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
        }

    }

    return (
        <div className={styles.wall}>
            <nav className={styles.wall__nav}>
                {["Записи", "Комментарии", "Видео", "Фотографии"].map((item, index) => (
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
                        { type === "post" || (type ==="profile" && editable) ?
                            <form className={styles.wall__feedForm} onSubmit={onSubmit} >
                                <div className={styles.textarea_wrapper} >
                                  <textarea
                                      name="description"
                                      id=""
                                      placeholder="Поделитесь с другими своими успехами и новостями!"
                                      value={textareaValue}
                                      onChange={(e) => setTextareaValue(e.target.value)}
                                  >
                                  </textarea>
                                  <Button className={styles.submit_button}>Отправить</Button>
                                </div>
                                <div className={styles.feenFormFooter} >
                                    <div className={styles.wall__feedFormFile}>
                                        {files.map(file => (
                                          <div key={file.id} className={styles.wall__feedFormFileDoc}>
                                            <span>{file.file?.name}</span>
                                            <button type='button' onClick={() => deleteFile(file.id)}></button>
                                          </div>
                                        ))}
                                        {
                                          files.length <= MAX_COUNT_FILES_IN_FORM &&
                                            <div className={styles.wall__feedFormFileField}>
                                            <input type='file' id='file' accept='image/*,video/*' onChange={handleFileChange}/>
                                            <label htmlFor='file'>
                                              <img src={attachmentIcon} alt=''/>
                                            </label>
                                          </div>
                                        }
                                    </div>
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
                            </form> : null
                        }
                        {sortedAllPosts.length ? sortedAllPosts.map((post, index) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                name={post.client.name}
                                avatar={post.client.avatar}
                                tags={null}
                                source={post.source}
                                comments={post.comments}
                                likes={post.likes_count}
                                liked_by={post.liked_by}
                                updated_at={post.created_at}
                                type={'all'}
                            >
                                {post.description}
                            </Post>
                        )) : null}
                    </div>
                )}
                {feedType === 1 && (
                    <p>Здесь должны быть комментарии</p>
                )}
                {feedType === 2 && (
                    <div className={styles.wall__feed}>
                        {sortedVideoPosts.length ? sortedVideoPosts.map((post, index) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                name={post.client.name}
                                avatar={post.client.avatar}
                                tags={null}
                                source={post.source}
                                comments={post.comments}
                                likes={post.likes_count}
                                liked_by={post.liked_by}
                                updated_at={post.created_at}
                                type={'video'}
                            >
                                {post.description}
                            </Post>
                        )) : null}
                    </div>
                )}
                {feedType === 3 && (
                    <div className={styles.wall__feed}>
                        {sortedImagePosts.length ? sortedImagePosts.map((post, index) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                name={post.client.name}
                                avatar={post.client.avatar}
                                tags={null}
                                source={post.source}
                                comments={post.comments}
                                likes={post.likes_count}
                                liked_by={post.liked_by}
                                updated_at={post.created_at}
                                type={'image'}
                            >
                                {post.description}
                            </Post>
                        )) : null}
                    </div>
                )}
            </div>
            <aside className={ type === "post" || type ==="profile" ? styles.wall__aside : `${styles.wall__aside} ${styles.wall__aside_sticky}`}>
                <div className={styles.wall__asideBlock}>
                    <form method="GET" action="#" className={styles.wall__form}>
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
                    { type === "post" ?
                        <div className={styles.wall__filter}>
                            {["Мои записи", "Записи друзей", "Записи Клубов"].map((item, index) => (
                                <button
                                    key={item + index}
                                    className={postType === index ? `${styles.wall__filterItem} ${styles.wall__filterItemActive}` : styles.wall__filterItem}
                                    type="button"
                                    onClick={() => setPostType(index)}
                                >{item}</button>
                            ))}
                        </div> : null
                    }
                </div>
                { type === "post" ?
                    <div className={styles.wall__asideBlock}>
                        <div className={styles.wall__users}>
                            <div className={styles.wall__usersTitle}>Популярные пользователи</div>
                            <ul className={styles.wall__usersList}>
                                { people.slice(0, 5).map((user, index) => (
                                    <li key={user.name + index}>
                                        <Link to={`/user/${user.id}`}>
                                            <User
                                                avatar={user.avatar}
                                                name={user.name}
                                                surname={user.surname}
                                                level={0}
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div> : null
                }
            </aside>
        </div>
    )
}

export default Wall
