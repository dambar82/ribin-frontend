import React, { useEffect } from 'react';
import Map from '../../components/Map/Map';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import styles from '../SingleEventPage/SingleEventPage.module.scss';
import background from '../../images/1383bd1e9c5ffe515f07e308cc8c8a83.jpg';
import placeIcon from '../../images/svg/placeIcon.svg';
import timeIcon from '../../images/svg/timeIcon.svg';
import organizerAvatar from '../../images/23cd5519888dd2579dca301059e7bd0e.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import {Link, useNavigate, useParams} from "react-router-dom";
import NewsCard from "../../components/NewsCard/NewsCard";
import buttonArrow from "../../images/svg/button_arrow.svg";
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { cancelParticipateInEvent, getEvent, participateInEvent } from '../../store/eventsSlice'

const photos = [
    '/images/6f05b9e6234fd9271db78f533dcfb2f7 (1).jpg',
    '/images/ffda317f14da69c2822dda6c537fa523.jpg',
    '/images/e0e7e6da8bd23a871f4faefe237826ef.png',
    '/images/e0e7e6da8bd23a871f4faefe237826ef.png',
    '/images/ffda317f14da69c2822dda6c537fa523.jpg',
    '/images/6f05b9e6234fd9271db78f533dcfb2f7 (1).jpg',
    '/images/ffda317f14da69c2822dda6c537fa523.jpg',
    '/images/e0e7e6da8bd23a871f4faefe237826ef.png',
    '/images/e0e7e6da8bd23a871f4faefe237826ef.png',
    '/images/ffda317f14da69c2822dda6c537fa523.jpg'
]

const SingleEventPage = () => {
  
  const event = useAppSelector((state) => state.events.event)
  const user = useAppSelector((state) => state.user.user)

  const dispatch = useAppDispatch()
  const params = useParams()

  useEffect(() => {
    if ( params.id ) {
      dispatch(getEvent({ id: params.id }))
    }
  }, [params])

  const participateInEventHandler = () => {
    dispatch(participateInEvent({
      event_id: event.id,
      user
    }))
    .then(res => {
      const payload = res.payload as any
      // alert(payload?.response)
    })
  }

  useEffect(() => {
      console.log(event);
  }, [event])

  const cancelParticipateInEventHandler = () => {
    dispatch(cancelParticipateInEvent({
      event_id: event.id,
      user
    }))
    .then(res => {
      const payload = res.payload as any
      // alert(payload?.response)
    })
  }

  if ( !event ) {
    return <div>Загрузка...</div>
  }

    return (
        <div className='page'>
            <Breadcrumbs/>
            <div className={styles.eventPage}>
                <div className={styles.eventPage_firstDeck}>
                    <div className={styles.eventBackground}>
                        <img src={event.caption} alt=""/>
                    </div>
                    <div className={styles.eventInfo}>
                        <div className={styles.eventInfo_left}>
                            <h2 className={styles.eventHeader}>
                                {event.name}
                            </h2>
                            <div className={styles.eventTime}>
                                <div className={styles.eventTime_block}>
                                    <img src={placeIcon} alt="placeIcon"/>
                                    <span>
                                        {event.location}
                                    </span>
                                </div>
                                <div className={styles.eventTime_block}>
                                    <img src={timeIcon} alt="placeIcon"/>
                                    <span style={{fontFamily: 'Saira', fontWeight: 500}}>
                                      {event.date}, {event.time}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.eventDescription}>
                                {event.description}
                            </div>
                            <div className={styles.eventOrganization}>
                                <div className={styles.eventClub}>
                                    <div className={styles.eventClub_avatar}>
                                        <img src={organizerAvatar} alt=""/>
                                    </div>
                                    <div className={styles.eventClub_info}>
                                        <span className={styles.eventClub_info_grey}>
                                            Организатор мероприятия
                                        </span>
                                        <span className={styles.eventClub_info_org}>
                                          {event.created_by.name} {event.created_by.surname}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.clubInfo__clients_wrapper}>
                                    <div className={styles.clubInfo__clients}>
                                      {event.clients?.map((client) => (
                                        <div key={client.id} className={styles.clubInfo__client}>
                                            <img src={client.avatar} alt="" />
                                        </div>
                                      ))}
                                    </div>
                                      <div className={styles.clubInfo__others}>
                                        <span className={styles.eventClub_info_grey}>
                                            Участники
                                        </span>
                                        <span className={styles.eventClub_info_org} style={{fontFamily: 'Saira'}}>
                                            +{event.clients?.length || 0}
                                        </span>
                                      </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.eventInfo_button}>
                        { event.clients?.some(el => el.id === user.id)
                        ?
                          <button
                            className={styles.eventButton}
                            onClick={cancelParticipateInEventHandler}
                          >
                            Не участвовать
                          </button>
                        :
                            <button
                              className={styles.eventButton}
                              onClick={participateInEventHandler}
                            >
                              Участвовать
                            </button>
                        }
                        </div>
                    </div>
                </div>
                <div className={styles.eventPage_Deck}>
                    <h2 className={styles.eventPage_regularHeader}>
                        Расположение
                    </h2>
                    <div className={styles.mapWrapper}>
                        <Map coordinates={[55.783063, 49.119782]}></Map>
                    </div>
                </div>
                <div className={styles.eventPage_Deck}>
                    <h2 className={styles.eventPage_regularHeader}>
                        Фотогалерея
                    </h2>
                    <div className={styles.eventPage_gallery}>
                      {event.source?.map((photo, index) => {
                        return (
                          <div key={photo} className={styles.eventPage_gallery_photo}>
                              <img src={photo} />
                          </div>
                        )}
                      )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleEventPage;
