import styles from "./PostCard.module.scss"

type Author = {
    author: string;
}
interface IPostCard {
    // name: string;
    // date: string;
    text: string;
    image?: string;
}

const PostCard = ({text, image}: IPostCard) => {
    return (
        <div className={styles.post}>
            <div className={`${styles.post__author} ${styles.author}`}>
                <div className={styles.author__avatar}>
                    <img src="/images/club-image.png" alt="" />
                </div>
                <div className={styles.author__name}>Иван Иванов</div>
                <div className={styles.author__date}>2ч назад</div>
            </div>
            <p className={styles.post__text}>{text}</p>
            {
                image && (
                    <div className={styles.post__image}>
                        <img src={image} alt="" />
                    </div>
                )
            }
        </div>
    )
}

export default PostCard