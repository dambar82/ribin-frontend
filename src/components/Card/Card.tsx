import styles from './Card.module.scss';

interface IClubCard {
    name: string;
    image: string;
    desc: string;
    tagIcon: string;
    tagLabel: string,
    // participants: number;
}


const Card = ({ name, image, desc, tagIcon, tagLabel }: IClubCard) => {
    return (
        <div className={styles.card}>
            <div className={styles.card__date}>12.07.2024, 16:00</div>
            <div className={styles.card__image}>
                { image && <img src={image} alt=''/>}
            </div>
            <div className={styles.card__content}>
                <div className={styles.card__tag}>
                    <div className={styles.card__tagIcon}>
                        <img src={tagIcon} />
                    </div>
                    <div className={styles.card__tagLabel}>{tagLabel}</div>
                </div>
                <h3 className={styles.card__title}>{ name }</h3>
                <p className={styles.card__desc}>{ desc }</p>
            </div>
        </div>
    );
};

export default Card;