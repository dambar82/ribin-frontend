import React from 'react';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import styles from '../SingleEventPage/SingleEventPage.module.scss';
import background from '../../images/1383bd1e9c5ffe515f07e308cc8c8a83.jpg';
import placeIcon from '../../images/svg/placeIcon.svg';
import timeIcon from '../../images/svg/timeIcon.svg';
import organizerAvatar from '../../images/23cd5519888dd2579dca301059e7bd0e.jpg';

const SingleEventPage = () => {
    return (
        <div className='page'>
            <Breadcrumbs/>
            <div className={styles.eventPage}>
                <div className={styles.eventPage_firstDeck}>
                    <div className={styles.eventBackground}>
                        <img src={background} alt=""/>
                    </div>
                    <div className={styles.eventInfo}>
                        <div className={styles.eventInfo_left}>
                            <h2 className={styles.eventHeader}>
                                Тренировка
                            </h2>
                            <div className={styles.eventTime}>
                                <div className={styles.eventTime_block}>
                                    <img src={placeIcon} alt="placeIcon"/>
                                    <span>
                                        Cтадион "Рубин", улица Спортивная, 15
                                    </span>
                                </div>
                                <div className={styles.eventTime_block}>
                                    <img src={timeIcon} alt="placeIcon"/>
                                    <span style={{fontFamily: 'Saira', fontWeight: 500}}>
                                        12.07.2024, 16:00
                                    </span>
                                </div>
                            </div>
                            <div className={styles.eventDescription}>
                                Мероприятие для тех, кто хочет улучшить свою физическую форму через футбольные тренировки. Включает кардиотренировки, специальные упражнения и футбольные игры. Также проводятся занятия по правильному питанию и общему укреплению здоровья.
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
                                            Фитнес клуб “Футбол и здоровье”
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.clubInfo__clients_wrapper}>
                                    <div className={styles.clubInfo__clients}>
                                        <div className={styles.clubInfo__client}>
                                            <img src="/images/club-client-01.png" alt="" />
                                        </div>
                                        <div className={styles.clubInfo__client}>
                                            <img src="/images/club-client-02.png" alt="" />
                                        </div>
                                        <div className={styles.clubInfo__client}>
                                            <img src="/images/club-client-03.png" alt="" />
                                        </div>
                                        <div className={styles.clubInfo__client}>
                                            <img src="/images/club-client-04.png" alt="" />
                                        </div>
                                        <div className={styles.clubInfo__client}>
                                            <img src="/images/club-client-05.png" alt="" />
                                        </div>
                                    </div>
                                    <div className={styles.clubInfo__others}>
                                        <span className={styles.eventClub_info_grey}>
                                            Участники
                                        </span>
                                        <span className={styles.eventClub_info_org} style={{fontFamily: 'Saira'}}>
                                            +13
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.eventInfo_button}>
                            <button className={styles.eventButton}>
                                Участвовать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleEventPage;
