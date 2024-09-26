import styles from './Post.module.scss'

import likeIcon from '../../images/svg/likes.svg'
import likeIconLiked from '../../images/svg/likes_red.svg'
import commentIcon from '../../images/svg/comments.svg'
import sharedIcon from '../../images/svg/shared.svg'
import Comment from '../Comment/Comment';
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import verifiedPost from '../../images/svg/verifiedPost.svg';
import {IComment} from "../../types";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {
    addComment,
    createComment,
    deletePost,
    deletePostAsync,
    editPostAsync,
    toggleLikeAsync
} from "../../store/postSlice";
import {RootState} from "../../store/store";
import {useEffect, useRef, useState} from "react";
import 'react-image-lightbox/style.css'; // Импорт стилей для lightbox
import Lightbox from 'react-image-lightbox';
import {Button} from "../../shared/UI";
import {postFormatDate} from "../../App";
import {Link, useNavigate} from "react-router-dom";
import {fetchPeople} from "../../store/peopleSlice";
import TextWithVideo from "../TextWithVideo/TextWithVideo";
import axios from "axios";

interface ICard {
    id: number;
    name: string;
    surname: string;
    avatar?: string;
    created_by: number;
    source?: string[];
    verified: number;
    tags?: string;
    comments?: IComment[]
    children?: React.ReactNode;
    likes: number;
    liked_by: number[];
    updated_at: string;
    title: string;
    type: 'all' | 'image' | 'video';
}

const token = JSON.parse(localStorage.getItem('token') || '')

console.log(token);

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

const Post = ({ id, name, surname, avatar, created_by, source, tags, comments, verified, title, likes, liked_by, updated_at, type }: ICard) => {

    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [postContent, setPostContent] = useState(title);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [postComments, setPostComments] = useState(comments);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [incorrectWords, setIncorrectWords] = useState(false);
    const [incorrectWordsPost, setIncorrectWordsPost] = useState(false);
    const contentRef = useRef(null);
    const navigate = useNavigate();
    const post = useSelector((state: RootState) => state.post.posts[type].find(post => post.id === id));
    const user = useSelector((state: RootState) => state.user);

    const [isLiked, setIsLiked] = useState(() => {
        if (user && user.user && liked_by) {
            return liked_by.includes(user.user.id);
        }
        return false; // Возвращаем false, если пользователь не найден или liked_by не задан
    });

    useEffect(() => {
        const hasVideo = /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|vk\.com|vimeo\.com|ok\.ru)\S*/.test(postContent);
        const textLength = postContent.replace(/<[^>]+>/g, '').length;

        if (hasVideo || textLength < 100) {
            setIsExpanded(true);
        } else if (contentRef.current && contentRef.current.scrollHeight > contentRef.current.clientHeight) {
            setIsTruncated(true);
        } else {
            setIsTruncated(false);
        }
    }, [isEditing, postContent]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (user && user.user) {
            if (user.user.id === created_by) {
                setIsAuthor(true);
            }
        }
    }, [])

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()

        if (user.user) {
            const form = e.currentTarget;
            const formData = new FormData(form);

            formData.append('text', formData.get('commentText') as string);

            try {
                const newPost = await dispatch(createComment({formData, postId: id})).unwrap();

                if (newPost) {
                    setPostComments([
                        ...postComments,
                        {
                            id: newPost.id,
                            text: newPost.text,
                            created_at: newPost.created_at,
                            avatar: newPost.avatar,
                            created_by: newPost.created_by,
                            name: newPost.name,
                            liked_by: [],
                            likes_count: 0,
                            child: []
                        }
                    ])

                    setCommentText('');
                    setShowAllComments(true);
                } else {
                    setIncorrectWords(true);
                    setTimeout(() => {
                        setIncorrectWords(false);
                    }, 2000)
                    return
                }

            } catch (error) {
                console.error('Ошибка при создании комментария:', error);
            }
        } else {
            navigate('/login');
        }
    }

    useEffect(() => {
        if (post && user.user) {
            setIsLiked(post.liked_by.includes(user.user.id));
        }
    }, [post, user]);

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

    const commentsToDisplay = showAllComments ? postComments : postComments.slice(0, 3);

    const openLightbox = (index) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };

    const handleDeleteClick = async () => {
        dispatch(deletePost({postId: id}));
        dispatch(deletePostAsync({postId: id}));
        const response = await axios.get(`https://api-rubin.multfilm.tatar/api/messages/rubick_notifications`, {headers: {Authorization: `Bearer ${token}`}});
        console.log(response.data);
    }

    const handleEditPost = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.append('description', postContent);
        formData.set('_method', 'put');

        const editPost = await dispatch(editPostAsync({postId: id, formData}));

        // @ts-ignore
        if (editPost.error) {
            setIncorrectWordsPost(true);
            setTimeout(() => {
                setIncorrectWordsPost(false);
            }, 2000)
            return
        } else {
            setIsEditing(false);
        }

    }

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleDeleteComment = (id) => {
        setPostComments(postComments.filter(comment => {
            return comment.id !== id;
        }))
    }

    return (
        <article className={styles.post}>
            <div className={styles.post__header}>
                <Link to={`/user/${created_by}`}>
                <div className={styles.post__mainInfo}>
                    <div className={styles.post__avatar}>
                            {avatar ?
                                <img src={avatar} alt="" /> :
                                <img src="/images/club-image.png" alt="" />
                            }
                    </div>
                    <div className={styles.post__title}>{name} {surname} {verified && <img src={verifiedPost} alt='' />}</div>
                    <div className={styles.post__createdAt}>{postFormatDate(post.created_at)}</div>
                </div>
                </Link>
                <DropdownMenu
                  isAuthor={isAuthor}
                  post={{ id, created_by, name, surname }}
                  deleteClick={handleDeleteClick}
                  editClick={handleEditClick}
                />
            </div>
            <div className={styles.post__body}>
                {
                    isEditing ? (
                            <form className={styles.post__commentsForm} onSubmit={handleEditPost}>
                                <div className={styles.textarea_wrapper} >
                                    <textarea
                                        name="editPost"
                                        id=""
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                    ></textarea>
                                    {
                                        incorrectWordsPost && (
                                            <div className={`${styles.symbols_message} ${incorrectWords ? styles.show : ''}`}>
                                                Вы используете недопустимые слова. Измените текст и повторите попытку.
                                            </div>
                                        )
                                    }
                                    <Button className={styles.submit_button}>Сохранить</Button>
                                </div>
                            </form>
                    ) : (
                        <>
                            <div className={`${styles.post__content} ${isExpanded ? styles.post__content_expanded : ''}`}
                                 ref={contentRef}
                                 // dangerouslySetInnerHTML={{
                                 //     __html: postContent
                                 // }}
                            >
                                <TextWithVideo htmlContent={postContent} />
                            </div>
                            {isTruncated && !isExpanded && (
                                <span className={styles.show_more_button} onClick={toggleExpand}>
                            Читать далее
                            </span>
                            )}
                            {isTruncated && isExpanded && (
                                <span className={styles.show_more_button} onClick={toggleExpand}>
                            Свернуть
                            </span>
                            )}
                        </>
                    )
                }
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
                <div className={`${styles.post__tag} ${styles.post__tag_comments}`} onClick={() => setShowCommentSection(!showCommentSection)}>
                    <div className={styles.post__tagIcon}>
                        <img src={commentIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>{postComments.length}</span>
                </div>
                {/*<div className={`${styles.post__tag} ${styles.post__tag_shared}`}>*/}
                {/*    <div className={styles.post__tagIcon}>*/}
                {/*        <img src={sharedIcon} alt="" />*/}
                {/*    </div>*/}
                {/*    <span className={styles.post__tagLabel}>12</span>*/}
                {/*</div>*/}
                {/*<div className={`${styles.post__tag} ${styles.post__tag_views}`}>*/}
                {/*    <div className={styles.post__tagIcon}>*/}
                {/*        <img src={viewIcon} alt="" />*/}
                {/*    </div>*/}
                {/*    <span className={styles.post__tagLabel}>122</span>*/}
                {/*</div>*/}
            </div>
            { showCommentSection ? (
                <div className={styles.post__comments}>
                    <div>
                      <p>Комментарии</p>
                      <span>{commentsToDisplay.length}</span>
                    </div>
                    <ul className={styles.post__commentsList}>
                        {commentsToDisplay.map((comment, index) => (
                            <li key={comment.id}>
                                <Comment
                                    key={comment.id}
                                    id = {comment.id}
                                    liked_by={comment.liked_by}
                                    text={comment.text}
                                    created_at={comment.created_at}
                                    likes_count={comment.likes_count}
                                    avatar={comment.avatar}
                                    name={comment.name}
                                    created_by={comment.created_by}
                                    deleteComment={handleDeleteComment}
                                />
                            </li>
                        ))}
                    </ul>
                    {
                        postComments.length > 3 && (
                            <button
                                className={styles.post__commentsMore}
                                type="button"
                                onClick={toggleComments}
                            >
                                {showAllComments ? <span>Скрыть комментарии</span> : <span>Показать больше комментариев ({postComments.length - 3})</span>}
                            </button>
                        )
                    }
                    <form onSubmit={onSubmit} className={styles.post__commentsForm}>
                        <div className={styles.textarea_wrapper} >
                        <textarea
                            name="commentText"
                            id=""
                            placeholder='Ваш Комментарий...'
                            cols={9}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                            {
                                incorrectWords && (
                                    <div className={`${styles.symbols_message}`}>
                                        Вы используете недопустимые слова. Измените текст и повторите попытку.
                                    </div>
                                )
                            }
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

