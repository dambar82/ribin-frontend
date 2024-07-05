import styles from './PersonCard.module.scss';

interface IPersonalCard {
    name: string;
    imageUrl: string;
}

const PersonCard = ({name, imageUrl}: IPersonalCard) => {
    return (
        <div className={styles.card}>
            <div className={styles.card__image}>
                <img src={imageUrl} alt="" />
            </div>
            <div className={styles.card__content}>
                <div className={styles.card__name}>{name}</div>
                <div className={styles.card__info}>
                    <span>Выпуск - 1991г.р</span>
                    <span>Клубы: Волгарь, КАМАЗ, Шинник, Пюник (Армения)</span>
                </div>
            </div>
        </div>
    )
}

export default PersonCard