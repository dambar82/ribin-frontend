import styles from "./EventCard.module.scss"
import { TEvent } from "../../shared/types/event.types"

import geoIcon from "../../images/svg/geo.svg"
import clockIcon from "../../images/svg/clock.svg"
import { classNames } from "../../shared/utils"

interface IEventCard {
  event: TEvent
}
const EventCard = ({ event }: IEventCard) => {    

  const onErrorImage = ( e: React.SyntheticEvent<HTMLImageElement, Event> ) => {
    const parent = e.currentTarget.parentNode
    parent.parentNode.removeChild(parent)
  }

    return (
        <div
          // className={event.completed ? `${styles.event} ${styles.event_completed}` : `${styles.event}`}
          className={`${styles.event}`}
        >
            <div className={styles.event__image}>
                <img src={event.source?.[0] || ''} onError={onErrorImage} />
            </div>
            <div className={styles.event__content}>
                <div className={styles.event__header}>
                    <div className={styles.event__title}>{ event.name }</div>
                    <div className={classNames(styles.event__status, event.status === 1 && styles.active)}>{event.status === 1 ? "Актуально" : 'Неактуально'}</div>
                    {/* <div className={styles.event__status}>{event.completed ? "Завершен" : "Актуально"}</div> */}
                </div>
                <div className={styles.event__info}>
                    <div className={styles.event__location}>
                        <img src={geoIcon} alt="" />
                        <span>{event.location}</span>
                    </div>
                    <div className={styles.event__date}>
                        <img src={clockIcon} alt="" />
                        <span>{event.date}, {event.time}</span>
                    </div>
                </div>
                <p className={styles.event__text}>{event.description}</p>
                <div className={styles.event__sponsor}>
                    <div className={styles.event__sponsorAvatar}>
                        <img src={'https://api-rubin.multfilm.tatar/storage/'+event?.created_by?.avatar} alt="" />
                    </div>
                    <div className={styles.event__sponsorLabel}>Организатор мероприятия</div>
                    <div className={styles.event__sponsorName}>{event.created_by.name} {event.created_by.surname}</div>
                </div>
            </div>
        </div>
    )
}

export default EventCard