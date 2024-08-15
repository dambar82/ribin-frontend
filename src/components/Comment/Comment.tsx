import styles from "./Comment.module.scss"

import DropdownMenu from "../DropdownMenu/DropdownMenu"
import likeIcon from '../../images/svg/likes.svg'
import {Client} from "../../types";

interface IComment {
    author: Client;
    text: string;
}

const Comment = ({ author, text }: IComment) => {

    console.log(text);

    return (
        <div className={styles.comment}>
        <div className={styles.comment__header}>
            <div className={`${styles.comment__author} ${styles.author}`}>
                <div className={styles.author__avatar}>
                    <img src={author.avatar} alt="" />
                </div>
                <div className={styles.author__name}>{author.name}</div>
                <div className={styles.authro__date}>13.03.2024 I 18:22</div>
            </div>
            <DropdownMenu />
        </div>
        <div className={styles.comment__body}>
            <p>{text}</p>
        </div>
        <div className={styles.comment__footer}>
            <div className={styles.comment__likes}>
                <div className={styles.comment__likesIcon}>
                    <img src={likeIcon} alt=""/>
                </div>
                <span className={styles.comment__label}>12</span>
            </div>
            <button className={`${styles.comment__button} ${styles.comment__button_reply}`} type="button">Ответить</button>
            <button className={`${styles.comment__button} ${styles.comment__button_share}`} type="button">Поделиться</button>
        </div>
    </div>
    )
}

export default Comment