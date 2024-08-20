import styles from './Post.module.scss'

import likeIcon from '../../images/svg/likes.svg'
import likeIconLiked from '../../images/svg/likes_red.svg'
import commentIcon from '../../images/svg/comments.svg'
import sharedIcon from '../../images/svg/shared.svg'
import Comment from '../Comment/Comment';
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import {IComment} from "../../types";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {addComment, createComment, toggleLikeAsync} from "../../store/postSlice";
import {RootState} from "../../store/store";
import {useEffect, useState} from "react";
import 'react-image-lightbox/style.css'; // Импорт стилей для lightbox
import Lightbox from 'react-image-lightbox';
import {Button} from "../../shared/UI";
import {postFormatDate} from "../../App";
import {Link} from "react-router-dom";

interface ICard {
    id: number;
    name: string;
    avatar?: string;
    created_by: number;
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

const Post = ({ id, name, avatar, created_by, source, tags, comments, children, likes, liked_by, updated_at, type }: ICard) => {

    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [postComments, setPostComments] = useState(comments);

    const post = useSelector((state: RootState) => state.post.posts[type].find(post => post.id === id));
    const user = useSelector((state: RootState) => state.user);

    const [isLiked, setIsLiked] = useState(liked_by.includes(user.user.id));

    const handleCommentSection = () => {

    }

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()

        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.append('text', formData.get('commentText') as string);

        try {
            const newPost = await dispatch(createComment({formData, postId: id})).unwrap();

            setPostComments([
                ...postComments,
                {
                    id: newPost.id,
                    text: newPost.text,
                    created_at: newPost.created_at,
                    liked_by: [],
                    likes_count: 0,
                    child: []
                }
            ])

            setCommentText('');
            setShowAllComments(true);

        } catch (error) {
            console.error('Ошибка при создании комментария:', error);
        }
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

    const commentsToDisplay = showAllComments ? postComments : postComments.slice(0, 3);

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
                            <Link to={`/user/${created_by}`}>
                                {avatar ?
                                    <img src={avatar} alt="" /> :
                                    <img src="/images/club-image.png" alt="" />
                                }
                            </Link>
                        </div>
                    <div className={styles.post__title}>{name}</div>
                    <div className={styles.post__createdAt}>{postFormatDate(post.created_at)}</div>
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
                <div className={`${styles.post__tag} ${styles.post__tag_comments}`} onClick={() => setShowCommentSection(!showCommentSection)}>
                    <div className={styles.post__tagIcon}>
                        <img src={commentIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>{postComments.length}</span>
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
            { showCommentSection || postComments.length > 0 ? (
                <div className={styles.post__comments}>
                <ul className={styles.post__commentsList}>
                    {commentsToDisplay.map((comment, index) => (
                        <li key={comment.id}>
                            <Comment
                                key={comment.id}
                                id = {comment.id}
                                liked_by={comment.liked_by}
                                author={post.client}
                                text={comment.text}
                                created_at={comment.created_at}
                                likes_count={comment.likes_count}
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
