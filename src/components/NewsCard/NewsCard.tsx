import styles from './NewsCard.module.scss';

const NewsCard = () => {
    return (
        <div className={styles.card}>
            <img src="images/news-image.png" alt="" className={styles.card__image} />
            <div className={styles.card__date}><span>12</span> марта</div>
            <div className={styles.card__title}>Стратегия Клуба Рубин на Ближайший Трансферный Период</div>
        </div>
    )
}

export default NewsCard