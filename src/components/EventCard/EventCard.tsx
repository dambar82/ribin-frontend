import styles from "./EventCard.module.scss"

import geoIcon from "../../images/svg/geo.svg"
import clockIcon from "../../images/svg/clock.svg"

interface IEventCard {
    name: string;
    image?: string;
    completed?: boolean;
}


const EventCard = ({name, image, completed}: IEventCard) => {    
    return (
        <div className={completed ? `${styles.event} ${styles.event_completed}` : `${styles.event}`}>
            <div className={styles.event__image}>
                <img src={image} alt="" />
            </div>
            <div className={styles.event__content}>
                <div className={styles.event__header}>
                    <div className={styles.event__title}>{ name }</div>
                    <div className={styles.event__status}>{completed ? "Завершен" : "Актуально"}</div>
                </div>
                <div className={styles.event__info}>
                    <div className={styles.event__location}>
                        <img src={geoIcon} alt="" />
                        <span>Cтадион "Рубин", улица Спортивная, 15</span>
                    </div>
                    <div className={styles.event__date}>
                        <img src={clockIcon} alt="" />
                        <span>12.07.2024, 16:00</span>
                    </div>
                </div>
                <p className={styles.event__text}>Мероприятие для тех, кто хочет улучшить свою физическую форму через футбольные тренировки. Включает кардиотренировки, специальные упражнения и футбольные игры. Также проводятся занятия по правильному питанию и общему укреплению здоровья. </p>
                <div className={styles.event__sponsor}>
                    <div className={styles.event__sponsorAvatar}>
                        <img src="/images/club-avatar.png" alt="" />
                    </div>
                    <div className={styles.event__sponsorLabel}>Организатор мероприятия</div>
                    <div className={styles.event__sponsorName}>Фитнес-клуб “Футбол и здоровье”</div>
                </div>
            </div>
        </div>
    )
}

export default EventCard