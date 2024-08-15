import styles from './Post.module.scss'

import likeIcon from '../../images/svg/likes.svg'
import likeIconLiked from '../../images/svg/likes_red.svg'
import commentIcon from '../../images/svg/comments.svg'
import sharedIcon from '../../images/svg/shared.svg'
import viewIcon from '../../images/svg/views.svg'
import Comment from '../Comment/Comment';
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import {IComment} from "../../types";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {toggleLikeAsync} from "../../store/postSlice";
import {RootState} from "../../store/store";
import {useEffect, useState} from "react";
import 'react-image-lightbox/style.css'; // Импорт стилей для lightbox
import Lightbox from 'react-image-lightbox';
import {Button} from "../../shared/UI";

interface ICard {
    id: number;
    name: string;
    avatar?: string;
    source?: string[];
    tags?: string;
    comments?: IComment[]
    children: React.ReactNode;
    likes: number;
    liked_by: number[];
    updated_at: string;
    type: 'all' | 'image' | 'video';
}

const determineMediaType = (src: string): 'image' | 'video' | undefined  => {
    if (src.endsWith('.mp4')) return 'video';
    if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) return 'image';
    return undefined ; // fallback case
};

function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
            size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
    };
}

function formatDate(isoString) {
    const date = new Date(isoString);

    // Получаем компоненты даты
    const day = String(date.getDate()).padStart(2, '0'); // День
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц (месяцы начинаются с 0)
    const year = date.getFullYear(); // Год

    // Получаем компоненты времени
    const hours = String(date.getHours()).padStart(2, '0'); // Часы
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Минуты

    // Форматируем строку
    return `${day}.${month}.${year} I ${hours}:${minutes}`;
}

const Post = ({ id, name, avatar, source, tags, comments, children, likes, liked_by, updated_at, type }: ICard) => {

    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [showAllComments, setShowAllComments] = useState(false);

    const post = useSelector((state: RootState) => state.post.posts[type].find(post => post.id === id));
    const user = useSelector((state: RootState) => state.user);

    const [isLiked, setIsLiked] = useState(liked_by.includes(user.user.id));

    const onSubmit = async () => {

    }

    useEffect(() => {
        if (post) {
            setIsLiked(post.liked_by.includes(user.user.id));
        }
    }, [post, user.user.id]);

    const handleLikeClick = () => {
        if (post && !isLiked) {
            dispatch(toggleLikeAsync({postId: id, postType: type, userId: user.user.id}))
                .unwrap()
                .then(() => {
                    setIsLiked(true);
                })
        }
    };

    const toggleComments = () => {
        setShowAllComments(!showAllComments);
    };

    const commentsToDisplay = showAllComments ? comments : comments.slice(-3);

    const openLightbox = (index) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };

    return (
        <article className={styles.post}>
            <div className={styles.post__header}>
                <div className={styles.post__mainInfo}>
                    <div className={styles.post__avatar}>
                        {avatar ?
                            <img src={avatar} alt="" /> :
                            <img src="/images/club-image.png" alt="" />
                        }
                    </div>
                    <div className={styles.post__title}>{name}</div>
                    <div className={styles.post__createdAt}>{formatDate(post.created_at)}</div>
                </div>
                <DropdownMenu />
            </div>
            <div className={styles.post__body}>
                <div className={styles.post__content}>
                    {children}
                </div>
                <div className={styles.post__tags}>{tags}</div>
                <div className={styles.post__media}>
                    {source?.map((media, index) => {
                        const type = determineMediaType(media);
                        if (!type) return null;
                        return (
                            <div key={index} className={styles.post__media_item} onClick={() => openLightbox(index)}>
                                {type === 'image' ? (
                                    <img src={media} alt={`media-${index}`} />
                                ) : type === 'video' ? (
                                    <video controls>
                                        <source src={media} type="video/mp4" />
                                        Your browser does not support the video.
                                    </video>
                                ) : null}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.post__footer}>
                <div className={`${styles.post__tag} ${styles.post__tag_likes}`} onClick={handleLikeClick}>
                    <div className={styles.post__tagIcon}>
                        <img
                            src={isLiked ? likeIconLiked : likeIcon}
                            alt=""
                        />
                    </div>
                    <span
                        className={`${styles.post__tagLabel} ${
                            isLiked ? styles.post__tagLabel_liked : ''
                        }`}
                    >
                        {post?.likes_count || 0}
                    </span>
                </div>
                <div className={`${styles.post__tag} ${styles.post__tag_comments}`}>
                    <div className={styles.post__tagIcon}>
                        <img src={commentIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>{comments.length}</span>
                </div>
                <div className={`${styles.post__tag} ${styles.post__tag_shared}`}>
                    <div className={styles.post__tagIcon}>
                        <img src={sharedIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>12</span>
                </div>
                {/*<div className={`${styles.post__tag} ${styles.post__tag_views}`}>*/}
                {/*    <div className={styles.post__tagIcon}>*/}
                {/*        <img src={viewIcon} alt="" />*/}
                {/*    </div>*/}
                {/*    <span className={styles.post__tagLabel}>122</span>*/}
                {/*</div>*/}
            </div>
            { comments.length ? (
                <div className={styles.post__comments}>
                <ul className={styles.post__commentsList}>
                    {commentsToDisplay.map((comment, index) => (
                        <li key={comment.id}>
                            <Comment key={comment.id} author={post.client} text={comment.text}/>
                        </li>
                    ))}
                </ul>
                    {
                        comments.length > 3 && (
                            <button
                                className={styles.post__commentsMore}
                                type="button"
                                onClick={toggleComments}
                            >
                                {showAllComments ? <span>Скрыть комментарии</span> : <span>Показать больше комментариев ({comments.length - 2})</span>}
                            </button>
                        )
                    }
                <form onSubmit={onSubmit} className={styles.post__commentsForm}>
                    <div className={styles.textarea_wrapper} >
                        <textarea name="" id="" placeholder='Ваш Комментарий...' cols={9}></textarea>
                        <Button className={styles.submit_button}>Отправить</Button>
                    </div>
                </form>
            </div>
            ) : null}
            {isOpen && (
                <Lightbox
                    mainSrc={source[photoIndex]}
                    nextSrc={source[(photoIndex + 1) % source.length]}
                    prevSrc={source[(photoIndex + source.length - 1) % source.length]}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + source.length - 1) % source.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % source.length)}
                />
            )}
        </article>
    )
}

export default Post
