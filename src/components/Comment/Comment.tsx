import styles from "./Comment.module.scss"

import DropdownMenu from "../DropdownMenu/DropdownMenu"
import likeIcon from '../../images/svg/likes.svg'

interface IComment {
    author: string;
    avatar: string;
}

const Comment = ({ author, avatar}: IComment) => {
    return (
        <div className={styles.comment}>
`        <div className={styles.comment__header}>
            <div className={`${styles.comment__author} ${styles.author}`}>
                <div className={styles.author__avatar}>
                    <img src={avatar} alt="" />
                </div>
                <div className={styles.author__name}>{author}</div>
                <div className={styles.authro__date}>13.03.2024 I 18:22</div>
            </div>
            <DropdownMenu />
        </div>
        <div className={styles.comment__body}>
            <p>Фитнес-клуб “Футбол и здоровье”, полностью согласен! Новая тренерская стратегия действительно внушает оптимизм. Интересно, как новички покажут себя в первых товарищеских матчах. В прошлом сезоне нам не хватало глубины состава, надеюсь, теперь это изменится. Будем болеть за наших!</p>
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
        </div>`
    </div>
    )
}

export default Comment