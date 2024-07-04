import styles from './NewsCard.module.scss';
import {formatDate, formatDateToDayMonth, parseAndFormatDate} from "../../App";

interface INewsCard {
    title: string,
    date: string,
    image: string,
}

const NewsCard = ({title, image, date}: INewsCard) => {
    console.log(formatDateToDayMonth(parseAndFormatDate(date)));
    return (
        <div className={styles.card}>
            { image && <img src={image} alt="" className={styles.card__image} /> }
            <div className={styles.card__date}>
                {formatDateToDayMonth(parseAndFormatDate(date))}
            </div>
            {/*{formatDate(date).replace(/\d{4}$/, '')}*/}
            <div className={styles.card__title}>{title}</div>
        </div>
    )
}

export default NewsCard;