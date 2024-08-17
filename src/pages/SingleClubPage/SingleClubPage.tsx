import { useEffect, useState } from 'react'
import styles from './SingleClubPage.module.scss';
import { useAppDispatch } from '../../store/hooks'
import { getClub } from '../../store/clubsSlice'

import geoIcon from '../../images/svg/geo.svg'

import Wall from '../../components/Wall/Wall';
import Row from '../../components/Row/Row';
import Card from '../../components/Card/Card';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const SingleClubPage = () => {
    const [feedType, setFeedType] = useState(0)
    const [sortType, setSortType] = useState(0)

    const club = useSelector((state: RootState) => state.clubs.club)

    const params = useParams()
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(getClub({ id: params.id }))
    }, [])

    return (
        <div className='page'>
            <section className={`section ${styles.clubInfo}`}>
                <div className={styles.clubInfo__image}>
                    <img src={club.caption} alt="" />
                </div>
                <div className={styles.clubInfo__content}>
                    <div className={styles.clubInfo__avatar}>
                        <div>
                            <img src={club.caption} alt="" />
                        </div>
                    </div>
                    <div className={styles.clubInfo__info}>
                        <div className={styles.clubInfo__infoHeader}>
                            <div>
                                <h1 className={styles.clubInfo__title}>{club.name}</h1>
                                <div className={styles.clubInfo__level}>Уровень 200</div>
                            </div>
                            <button className="button button--main" type="button">
                                <span>Вступить в Клуб</span>
                            </button>
                        </div>
                        <div className={styles.clubInfo__infoDesc}>
                            <p>{club.description}</p>
                        </div>
                        <div className={styles.clubInfo__infoFooter}>
                            <div className={styles.clubInfo__author + " " + styles.author}>
                                <div className={styles.author__avatar}>
                                    <img src="/images/club-owner.png" alt="" />
                                </div>
                                <div className={styles.author__position}>Организатор</div>
                                <div className={styles.author__name}>Андрей Афанасьев</div>
                            </div>
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
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className='section__header'>
                    <h2 className='section__title'>Мероприятия</h2>
                    <div className='section__counter'>3</div>
                </div>
                <div className='section__body'>
                    <Row>
                        {/* <div className='row'> */}
                        {[ "Тренировка", "Дружеский матч", "Мастер-класс от профессионального тренера"].map((name, index) => (
                            <Card
                                key={index}
                                date='12.07.2024, 16:00'
                                name={name}
                                image='/images/event.png'
                                desc="Клуб для тех, кто хочет улучшить свою физическую форму через футбольные тренировки. Включает кардиотренировки, специальные упражнения и футбольные игры. Также проводятся занятия по правильному питанию и общему укреплению здоровья."
                                tagIcon={geoIcon}
                                tagLabel='Cтадион "Рубин", улица Спортивная, 15'
                            />
                        ))}
                        {/* </div> */}
                    </Row>
                </div>
            </section>
            <section className={`section ${styles.feed}`}>
                <div className="section__header">
                    <h2 className="section__title">Лента клуба</h2>
                    <div className="section__counter">5</div>
                </div>
                <div className={`section__body`}>
                    <Wall
                        type="club"
                        posts={null}
                    />
                </div>
            </section>
        </div>
    );
};

export default SingleClubPage;
