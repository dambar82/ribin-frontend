import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchEvents } from "../../store/eventsSlice"
import { Button } from "../../shared/UI"
import { CreateEvent } from "./create-event/CreateEvent"

import styles from "./EventsPage.module.scss";

import EventCard from "../../components/EventCard/EventCard";

const EventsPage = () => {
  
  const events = useAppSelector((state) => state.events.events)
  
  const [activeTab, setActiveTab] = useState(0)
  const [active, setActive] = useState(1)

  const dispatch = useAppDispatch()

    useEffect(() => {
      dispatch(fetchEvents())
    }, [])

    if ( activeTab === 1 ) {
      return <CreateEvent
        setActiveTab={setActiveTab}
      />
    }

    const createEvent = () => {
      setActiveTab(1)
      setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 100)
    }

    return (
        <div className="page">
            <div className={styles.events}>
                <div className={styles.events__header}>
                    <h1 className={styles.events__title}>Все мероприятия</h1>
                    <div className={styles.events__counter}>{events.length}</div>
                    {/* <nav className="tab-nav">
                        {["Список", "На карте"].map((item, index) => (
                            <button
                              key={index}
                                onClick={() => setActive(index + 1)}
                                className={`tab-button ${active === index + 1 ? "tab-button--active" : ""} button button--white`}
                                type="button"
                            >
                                <span>{item}</span>
                            </button>
                        ))}
                    </nav> */}
                </div>
                <div className={styles.create_event_button_wrapper} >
                  <Button onClick={createEvent} >Создать мероприятие</Button>
                </div>
                <div className={styles.events__body}>
                {active === 1
                    ? (
                        <div className={styles.events__list}>
                            {[...events].reverse().map(event => (
                                <Link
                                  key={event.id}
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
