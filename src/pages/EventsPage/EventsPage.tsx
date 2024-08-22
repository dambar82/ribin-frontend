import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchEvents } from "../../store/eventsSlice"

import styles from "./EventsPage.module.scss";

import EventCard from "../../components/EventCard/EventCard";

const EventsPage = () => {
  
  const events = useAppSelector((state) => state.events.events);
  
  const dispatch = useAppDispatch()
  
  const [active, setActive] = useState(1)

    useEffect(() => {
      dispatch(fetchEvents())
    }, [])

    return (
        <div className="page">
            <div className={styles.events}>
                <div className={styles.events__header}>
                    <h1 className={styles.events__title}>Все мероприятия</h1>
                    <div className={styles.events__counter}>230</div>
                    <nav className="tab-nav">
                        {["Список", "На карте"].map((item, index) => (
                            <button
                                onClick={() => setActive(index + 1)}
                                className={`tab-button ${active === index + 1 ? "tab-button--active" : ""} button button--white`}
                                type="button"
                            >
                                <span>{item}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className={styles.events__body}>
                {active === 1
                    ? (
                        <div className={styles.events__list}>
                            {events.map(event => (
                                <Link
                                  key={event.name}
                                  to={`/events/event/${event.id}`}
                                  // className={event.completed ? styles.disableLink : ""}
                                >
                                    <EventCard
                                        event={event}
                                    />
                                </Link>
                                ))}
                        </div>
                    )
                    : <div className={styles.events__map}></div>
                }
                </div>
            </div>
        </div>
    )
}

export default EventsPage
