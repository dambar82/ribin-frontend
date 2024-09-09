import React, { useEffect, useState } from 'react';
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
import { cancelParticipateInEvent, deleteEvent, getEvent, participateInEvent } from '../../store/eventsSlice'
import { classNames } from '../../shared/utils'
import { Modal } from '../../shared/UI'

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

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [activeModal, setActiveModal] = useState(false)
    const [activePhoto, setActivePhoto] = useState(0)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const isAdmin = event?.created_by?.id === user.id

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
  }

  useEffect(() => {
      console.log(event);
  }, [event])

  const cancelParticipateInEventHandler = () => {
    dispatch(cancelParticipateInEvent({
      event_id: event.id,
      user
    }))
  }

  const deleteEventHandler = () => {
    if ( confirmDelete ) {
      dispatch(deleteEvent(event.id))
        .then(() => {
          navigate('/events')
        })
    }
    else {
      setConfirmDelete(true)
      setTimeout(() => {
        setConfirmDelete(false)
      }, 2000)
    }
  }

  const openModalHandler = ( index: number ) => {
    setActivePhoto(index)
    setTimeout(() => {
      setActiveModal(true)
    }, 100)
  }

  if ( !event ) {
    return <div>Загрузка...</div>
  }

    return (
        <div className='page'>
            <Breadcrumbs currentPageName={event.name} />
            <div className={styles.eventPage}>
                <div className={styles.eventPage_firstDeck}>
                    {/* <div className={styles.eventBackground}>
                        <img src={event.caption} alt=""/>
                    </div> */}
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
                                        <img src={'https://api-rubin.multfilm.tatar/storage/'+event.created_by?.avatar} alt=""/>
                                    </div>
                                    <div className={styles.eventClub_info}>
                                        <span className={styles.eventClub_info_grey}>
                                            Организатор мероприятия
                                        </span>
                                        <span className={styles.eventClub_info_org}>
                                          {event.created_by?.name} {event.created_by?.surname}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.clubInfo__clients_wrapper}>
                                    <div className={styles.clubInfo__clients}>
                                      {event.participants?.map((client) => (
                                        <div key={client.id} className={styles.clubInfo__client}>
                                            <img src={'https://api-rubin.multfilm.tatar/storage/'+client?.avatar} alt="" />
                                        </div>
                                      ))}
                                    </div>
                                      <div className={styles.clubInfo__others}>
                                        <span className={styles.eventClub_info_grey}>
                                            Участники
                                        </span>
                                        <span className={styles.eventClub_info_org} style={{fontFamily: 'Saira'}}>
                                            +{event.participants?.length || 0}
                                        </span>
                                      </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.eventInfo_button}>
                        { !isAdmin &&
                        (event.participants?.some(el => el.id === user.id)
                          ?
                            <button
                              className={classNames(styles.eventButton, styles.cancelParticipate)}
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
                          )
                        }
                        {isAdmin &&
                          <button
                            className={styles.eventButton}
                            onClick={deleteEventHandler}
                          >
                            {confirmDelete ? 'Подтвердить' : 'Удалить мероприятие'}
                          </button>
                        }
                        </div>
                    </div>
                </div>
                {/* Логика мероприятия //////////////////////////////////////////////// */}
                {/* <div className={styles.eventPage_Deck}>
                    <h2 className={styles.eventPage_regularHeader}>
                        Расположение
                    </h2>
                    <div className={styles.mapWrapper}>
                        <Map coordinates={event.coordinates ? event.coordinates : [55.783063, 49.119782]}></Map>
                    </div>
                </div> */}
                {/* Логика мероприятия //////////////////////////////////////////////// */}
                {event.source?.length > 0 &&
                  <div className={styles.eventPage_Deck}>
                    <h2 className={styles.eventPage_regularHeader}>
                        Фотогалерея
                    </h2>
                    <div className={styles.eventPage_gallery}>
                      {event.source?.map((photo, index) => {
                        return (
                          <div
                            key={photo}
                            className={styles.eventPage_gallery_photo}
                            onClick={() => openModalHandler(index)}
                          >
                            <img src={photo} />
                          </div>
                        )}
                      )}
                      <Modal
                        active={activeModal}
                        setActive={setActiveModal}
                        className={styles.photogallery_modal}
                        bodyClassName={styles.photogallery_modal_body}
                      >
                        <div className={styles.photogallery_slide} >
                          <img src={event.source?.find((_, i) => i === activePhoto)} alt="#" />
                        </div>
                      </Modal>
                    </div>
                  </div>
                }
            </div>
        </div>
    );
};

export default SingleEventPage;
