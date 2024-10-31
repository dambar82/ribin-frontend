import styles from './NewsCard.module.scss';
import {formatDate, formatDateToDayMonth, parseAndFormatDate} from "../../App";

interface INewsCard {
    title: string,
    date: string,
    image: string,
    newsBack: boolean,
    isFixed: boolean
}

const NewsCard = ({title, image, date, newsBack, isFixed}: INewsCard) => {
    return (
        <div className={styles.card}>
            { image && <img src={image} alt="" className={styles.card__image} /> }
            <div className={styles.card__overlay}></div>
            <div className={styles.card__date}>
                {
                    newsBack ?
                        formatDate(date)
                         :
                        formatDateToDayMonth(parseAndFormatDate(date))
                }
            </div>
            {isFixed && <div className={styles.card__title_fixed}>
                {title}
            </div>
            }
            {!isFixed && <div className={styles.card__title}>{title}</div>}
        </div>
    )
}

export default NewsCard;