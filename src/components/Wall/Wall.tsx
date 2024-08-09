import { useState } from 'react'
import styles from './Wall.module.scss';

import loupeIcon from '../../images/svg/loupe.svg'
import attachmentIcon from '../../images/svg/attachment.svg'

import Select from 'react-select';

import {PostAnswer} from "../../store/postSlice";
import Post from '../Post/Post';


interface IWall {
    posts: PostAnswer;
    type: string;
    editable?: boolean;
}

interface IUser {
    avatar?: string;
    name: string;
    level: number
}

const User = ({avatar, name, level}: IUser) => {
    return (
        <div className={styles.user}>
            <div className={styles.user__avatar}>
                { avatar && <img src={avatar} alt="" /> }
            </div>
            <div className={styles.user__name}>{name}</div>
            <div className={styles.user__level}>
                <span>Уровень</span><span>{level}</span>
            </div>
        </div>
    )
}

const Wall = ({type, posts, editable = true}: IWall) => {
    const optionsMap = {
        'public': { value: 'public', label: 'Опубликовать для всех' },
        'private': { value: 'private', label: 'Опубликовать для друзей' },
    }

    const options = Object.values(optionsMap);

    const [feedType, setFeedType] = useState(0)
    const [sortType, setSortType] = useState(0)
    const [postType, setPostType] = useState(0)
    const [file, setFile] = useState(null)
    const [option, setOption] = useState(optionsMap.public)

    const users = [
        { avatar: "/images/popular-user-01.png", name: "Амина Ушакова", level: 201 },
        { avatar: "/images/popular-user-02.png", name: "Артем Егоров", level: 180 },
        { avatar: "/images/popular-user-03.png", name: "Вера Дроздова", level: 140 },
        { avatar: "/images/popular-user-04.png", name: "Анна Емельянова", level: 135 },
        { avatar: "/images/popular-user-05.png", name: "Георгий Воробьев", level: 95 }
    ]

    const handleFileChange = (e) => {
        console.log(e.target.files)

        if (e.target.files[0].size > 100 * 1024 * 1024) {
            alert("Размер файла не должен превышать 30 MB")
            return
        }

        setFile(e.target.files[0])
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
                            <form action="#" method="POST" className={styles.wall__feedForm}>
                                <textarea name="" id="" placeholder="Поделитесь с другими своими успехами и новостями!"></textarea>
                                <div>
                                    <div className={styles.wall__feedFormFile}>
                                        { file ?
                                            <div className={styles.wall__feedFormFileDoc}>
                                                <span>{file.name}</span>
                                                <button type='button' onClick={() => setFile(null)}></button>
                                            </div> :
                                            <div className={styles.wall__feedFormFileField}>
                                                <input type='file' id='file' accept='' onChange={handleFileChange}/>
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
                                        //     control: (provided) => ({
                                        //       ...provided,
                                        //       backgroundColor: 'var(--colors-ui-base)',
                                        //       color: 'var(--colors-text)',
                                        //       borderRadius: 'var(--radii)',
                                        //       padding: '0.25rem',
                                        //       border: 'none',
                                        //       boxShadow: 'var(--shadow)',
                                        //       height: '50px',
                                        //     }),
                                        //     option: (provided, state) => ({
                                        //       ...provided,
                                        //       cursor: 'pointer',
                                        //       color: 'var(--colors-text)',
                                        //       backgroundColor: state.isSelected
                                        //         ? 'var(--colors-bg)'
                                        //         : 'var(--colors-ui-base)',
                                        //     }),
                                        //   },
                                    />
                                </div>
                            </form> : null
                        }
                        {posts.all.length ? posts.all.map((post, index) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                name={post.client.name}
                                avatar={post.client.avatar}
                                tags={null}
                                source={post.source}
                                comments={post.comments}
                                likes={post.likes_count}
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
                    <p>Здесь должны быть видео</p>
                )}
                {feedType === 3 && (
                    <p>Здесь должны быть фотографии</p>
                )}
            </div>
            <aside className={ type === "post" || type ==="profile" ? styles.wall__aside : `${styles.wall__aside} ${styles.wall__aside_sticky}`}>
                <div className={styles.wall__asideBlock}>
                    <form method="GET" action="#" className={styles.wall__form}>
                        <button type="button">
                            <img src={loupeIcon} alt="" />
                        </button>
                        <input type="text" placeholder='Поиск'/>
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
                                { users.map((user, index) => (
                                    <li key={user.name + index}>
                                        <User
                                            avatar={user.avatar}
                                            name={user.name}
                                            level={user.level}
                                        />
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
