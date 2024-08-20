import {useEffect, useState} from 'react'
import c from './SingleClubPage.module.scss';
import { useAppDispatch } from '../../store/hooks'
import { getClub } from '../../store/clubsSlice'
import { useParams } from 'react-router-dom'
import {fetchPostsByClubId, fetchPostsByUserId} from "../../store/postSlice";
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Wall from '../../components/Wall/Wall';
import Row from '../../components/Row/Row';
import Card from '../../components/Card/Card';

import geoIcon from '../../images/svg/geo.svg'
//@ts-ignore
import banner from '../../images/default_club_banner.png'
//@ts-ignore
import avatar from '../../images/default_club_avatar.png'
import { JoinTheClubButton } from './components'
import { EditClubTab } from './tabs/edit-club-tab/EditClubTab'
import { Button } from '../../shared/UI'
import { CreateClubEvent } from './tabs/create-club-event/CreateClubEvent'
import { SuccessCreateEvent } from './tabs/success-create-event/SuccessCreateEvent'


const SingleClubPage = () => {

    const { posts } = useSelector((state: RootState) => state.post)
    const club = useSelector((state: RootState) => state.clubs.club)
    
    const [activeTab, setActiveTab] = useState(3)

    const params = useParams()
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(getClub({ id: params.id }))
    }, [])

    useEffect(() => {
            dispatch(fetchPostsByClubId({clubId: 1}));
    }, [dispatch]);

    if ( !club ) {
      return <div>Клуб не найден</div>
    }

    const isAdmin = true

    if ( activeTab === 1 ) {
      return <EditClubTab
        club={club}
        setActiveTab={setActiveTab}
      />
    }

    if ( activeTab === 2 ) {
      return <CreateClubEvent
        club={club}
        setActiveTab={setActiveTab}
      />
    }

    return (
        <div className='page'>
            <section className={`section ${c.clubInfo}`}>
                <div className={c.clubInfo__image}>
                    <img src={club.caption || banner} />
                </div>
                <div className={c.clubInfo__content}>

                    <div className={c.clubInfo__avatar}>
                        <div>
                            <img src={club.caption || avatar} alt="" />
                        </div>
                    </div>
                    
                    <div className={c.clubInfo__info}>
                        <div className={c.clubInfo__infoHeader}>
                            <div>
                                <h1 className={c.clubInfo__title}>{club.name}</h1>
                            </div>
                            {isAdmin
                              ? <Button
                                  onClick={() => {
                                    setActiveTab(1)
                                    setTimeout(
                                      () => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }),
                                      100
                                    )
                                  }}
                                >
                                  Редактировать клуб
                                </Button>
                              : <JoinTheClubButton>Вступить в клуб</JoinTheClubButton>
                            }
                        </div>
                        <div className={c.clubInfo__infoDesc}>
                            <p>{club.description}</p>
                        </div>
                        <div className={c.clubInfo__infoFooter}>
                            <div className={c.clubInfo__author + " " + c.author}>
                                <div className={c.author__avatar}>
                                    <img src="/images/club-owner.png" alt="" />
                                </div>
                                <div className={c.author__position}>Организатор</div>
                                <div className={c.author__name}>Андрей Афанасьев</div>
                            </div>
                            <div className={c.clubInfo__clients}>
                                <div className={c.clubInfo__client}>
                                    <img src="/images/club-client-01.png" alt="" />
                                </div>
                                <div className={c.clubInfo__client}>
                                    <img src="/images/club-client-02.png" alt="" />
                                </div>
                                <div className={c.clubInfo__client}>
                                    <img src="/images/club-client-03.png" alt="" />
                                </div>
                                <div className={c.clubInfo__client}>
                                    <img src="/images/club-client-04.png" alt="" />
                                </div>
                                <div className={c.clubInfo__client}>
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
            <section className={`section ${c.feed}`}>
                <div className="section__header">
                    <h2 className="section__title">Лента клуба</h2>
                    <div className="section__counter">5</div>
                </div>
                <div className={`section__body`}>
                    <Wall
                        type="club"
                        posts={posts}
                    />
                </div>
            </section>
        </div>
    )
}

export default SingleClubPage;
