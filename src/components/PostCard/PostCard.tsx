import styles from "./PostCard.module.scss"
import {postFormatDate} from "../../App";

type Author = {
    author: string;
}
interface IPostCard {
    // name: string;
    // date: string;
    text: string;
    image?: string;
    created_at: string;
    client: any;
}

const PostCard = ({text, image, created_at, client}: IPostCard) => {
    return (
        <div className={styles.post}>
            <div className={`${styles.post__author} ${styles.author}`}>
                <div className={styles.author__avatar}>
                    <img src={client.avatar} alt="" />
                </div>
                <div className={styles.author__name}>{client.name} {client.surname}</div>
                <div className={styles.author__date}>{postFormatDate(created_at)}</div>
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