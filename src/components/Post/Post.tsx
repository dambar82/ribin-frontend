import styles from './Post.module.scss'

import likeIcon from '../../images/svg/likes.svg'
import commentIcon from '../../images/svg/comments.svg'
import sharedIcon from '../../images/svg/shared.svg'
import viewIcon from '../../images/svg/views.svg'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import Comment from '../Comment/Comment'

type Comment = {
    avatar: string;
    author: string;
}

interface ICard {
    name: string;
    avatar?: string;
    image?: string;
    tags?: string;
    comments?: Comment[]
    children: React.ReactNode;
}

const Post = ({ name, avatar, image, tags, comments, children }: ICard) => {
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
                { image && (
                    <div className={styles.post__image}>
                        <img src={image} alt="" />
                    </div>
                )}
            </div>
            <div className={styles.post__footer}>
                <div className={`${styles.post__tag} ${styles.post__tag_likes}`}>
                    <div className={styles.post__tagIcon}>
                        <img src={likeIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>12</span>
                </div>
                <div className={`${styles.post__tag} ${styles.post__tag_comments}`}>
                    <div className={styles.post__tagIcon}>
                        <img src={commentIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>0</span>
                </div>
                <div className={`${styles.post__tag} ${styles.post__tag_shared}`}>
                    <div className={styles.post__tagIcon}>
                        <img src={sharedIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>12</span>
                </div>
                <div className={`${styles.post__tag} ${styles.post__tag_views}`}>
                    <div className={styles.post__tagIcon}>
                        <img src={viewIcon} alt="" />
                    </div>
                    <span className={styles.post__tagLabel}>122</span>
                </div>
            </div>
            { comments.length ? (
                <div className={styles.post__comments}>
                <ul className={styles.post__commentsList}>
                    {comments.map((comment, index) => (
                        <li key={comment.author + index}>
                            <Comment key={comment.author + index} author={comment.author} avatar={comment.avatar} />
                        </li>
                    ))}
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