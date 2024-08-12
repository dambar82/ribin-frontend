import styles from './Post.module.scss'

import likeIcon from '../../images/svg/likes.svg'
import commentIcon from '../../images/svg/comments.svg'
import sharedIcon from '../../images/svg/shared.svg'
import viewIcon from '../../images/svg/views.svg'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import {IComment} from "../../types";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {toggleLikeAsync} from "../../store/postSlice";
import {RootState} from "../../store/store";
import {useEffect} from "react";

interface ICard {
    id: number;
    name: string;
    avatar?: string;
    source: string[];
    tags?: string;
    comments?: IComment[]
    children: React.ReactNode;
    likes: number;
    type: 'all' | 'image' | 'video';
}

const determineMediaType = (src: string): 'image' | 'video' | undefined  => {
    if (src.endsWith('.mp4')) return 'video';
    if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) return 'image';
    return undefined ; // fallback case
};

const Post = ({ id, name, avatar, source, tags, comments, children, likes, type }: ICard) => {

    const dispatch = useAppDispatch();

    const post = useSelector((state: RootState) => state.post.posts[type].find(post => post.id === id));
    const likedPosts = useSelector((state: RootState) => state.post.likedPosts);
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        console.log(source);
    }, [source])

    const handleLikeClick = () => {
        if (post && !likedPosts.includes(id)) {
            dispatch(toggleLikeAsync({postId: id, postType: type, userId: user.user.id}));
        }
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
                    <div className={styles.post__createdAt}>13.03.2024 I 17:31</div>
                </div>
                <DropdownMenu />
            </div>
            <div className={styles.post__body}>
                <div className={styles.post__content}>
                    {children}
                </div>
                <div className={styles.post__tags}>{tags}</div>
                <div className={styles.post__media}>
                    {source.map((media, index) => {
                        const type = determineMediaType(media);
                        if (!type) return null;
                        return (
                            <div key={index} className={styles.post__media_item}>
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
                        <img src={likeIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>{post?.likes_count || 0}</span>
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
                    {/*{comments.map((comment, index) => (*/}
                    {/*    <li key={comment.id}>*/}
                    {/*        <Comment key={comment.id} author={comment.author} avatar={comment.avatar} />*/}
                    {/*    </li>*/}
                    {/*))}*/}
                </ul>
                <button className={styles.post__commentsMore} type="button">Показать больше комментариев(<span>119</span>)</button>
                <form action="#" method="POST" className={styles.post__commentsForm}>
                    <textarea name="" id="" placeholder='Ваш Комментарий...' cols={9}></textarea>
                </form>
            </div>
            ) : null}
        </article>
    )
}

export default Post
