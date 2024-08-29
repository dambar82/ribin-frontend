import { classNames } from '../../shared/utils'
import styles from './Card.module.scss';

interface IClubCard {
    date?: string;
    name: string;
    image: string;
    desc?: string;
    tagIcon?: string;
    tagLabel?: string,
    buttonLabel?: string;
    // participants: number;
    className?: string
    onClick?: () => void
}


const Card = ({ date, name, image, desc, tagIcon, tagLabel, buttonLabel, className, onClick }: IClubCard) => {
    return (
        <div className={classNames(styles.card, className)} onClick={onClick} >
            { date && <div className={styles.card__date}>{date}</div>}
            <div className={styles.card__image}>
                { image && <img src={image} alt=''/>}
            </div>
            <div className={styles.card__content}>
                {tagIcon && tagLabel &&
                  <div className={styles.card__tag}>
                    <div className={styles.card__tagIcon}>
                        <img src={tagIcon} />
                    </div>
                    <div className={styles.card__tagLabel}>{tagLabel}</div>
                  </div>
                }
                <h3 className={styles.card__title}>{ name }</h3>
                { desc && <p className={styles.card__desc}>{ desc }</p>}
                { buttonLabel && <button className={`${styles.card__button} button button--black`} type="button">
                    <span>{buttonLabel}</span>
                </button>}
            </div>
        </div>
    );
};

export default Card;