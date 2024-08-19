import styles from "./Tag.module.scss"

interface ICard {
    icon: string;
    count: number | string;
    onClick?: () => void
}

const Tag = ({icon, count, onClick}: ICard) => {

    return (
        // <div className={`${styles.post__tag} ${styles.post__tag_shared}`}>
        <div className={styles.tag}>
            <div className={styles.tag__icon}>
                <img src={icon} alt="" />
            </div>
            <span className={styles.tag__label}>{count}</span>
        </div>
    )
}

export default Tag
