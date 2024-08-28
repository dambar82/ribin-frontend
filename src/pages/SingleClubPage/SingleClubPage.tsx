import {useEffect, useState} from 'react'
import c from './SingleClubPage.module.scss';
import { useAppDispatch } from '../../store/hooks'
import { getClub } from '../../store/clubsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import {fetchPostsByClubId, fetchPostsByUserId} from "../../store/postSlice";
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { JoinTheClubButton } from './components'
import { EditClubTab } from './tabs/edit-club-tab/EditClubTab'
import { Button } from '../../shared/UI'
import { CreateClubEvent } from './tabs/create-club-event/CreateClubEvent'
import Wall from '../../components/Wall/Wall';
import Row from '../../components/Row/Row';
import Card from '../../components/Card/Card';

import geoIcon from '../../images/svg/geo.svg'
//@ts-ignore
import banner from '../../images/default_club_banner.png'
//@ts-ignore
import avatar from '../../images/default_club_avatar.png'
import { classNames } from '../../shared/utils'


const SingleClubPage = () => {

    const { id } = useSelector((state: RootState) => state.user.user)
    const { posts, status, error } = useSelector((state: RootState) => state.post)
    const club = useSelector((state: RootState) => state.clubs.club)
    const [activeTab, setActiveTab] = useState(0)

    const params = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      dispatch(getClub({ id: params.id }))
    }, [])

    useEffect(() => {
            dispatch(fetchPostsByClubId({clubId: Number(params.id)}));
    }, []);

    if (status === 'loading' || !club) {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    const isAdmin = id === club.created_by?.id

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

    const createEvent = () => {
      setActiveTab(2)
      setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 100)
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
                            <img src={club.avatar || avatar} alt="" />
                        </div>
                    </div>

                    <div className={c.clubInfo__info}>
                        <div className={c.clubInfo__infoHeader}>
                            <div>
                                <h1 className={c.clubInfo__title}>{club.name}</h1>
                            </div>
                            {isAdmin &&
                              <Button
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
                            }
                            { !isAdmin &&
                              !club.clients?.some(el => el.id === id) &&
                                <JoinTheClubButton
                                  club_id={club.id}
                                >
                                  Вступить в клуб
                                </JoinTheClubButton>
                            }
                        </div>
                        <div className={c.clubInfo__infoDesc}>
                            <p>{club.description}</p>
                        </div>
                        <div className={c.clubInfo__infoFooter}>
                            <div className={c.clubInfo__author + " " + c.author}>
                                <div className={c.author__avatar}>
                                    <img src={'https://api-rubin.multfilm.tatar/storage/'+club.created_by?.avatar} alt="" />
                                </div>
                                <div className={c.author__position}>Организатор</div>
                                <div className={c.author__name}>{club.created_by?.name} {club.created_by?.surname}</div>
                            </div>
                            <div className={c.clubInfo__clients}>
                                {club.clients?.map((client, i) => (
                                  <div key={i} className={c.clubInfo__client}>
                                    <img src={'https://api-rubin.multfilm.tatar/storage/'+client?.avatar} />
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <section className="section">
                <div className='section__header'>
                    <h2 className='section__title'>Мероприятия</h2>
                    <div className='section__counter'>{club.events?.length}</div>
                </div>
                <div className={classNames('section__body', c.section_body)}>

                  {isAdmin &&
                    <div className={c.create_club_event} onClick={createEvent} >
                      <span>Создать новое мероприятие</span>
                    </div>
                  }

                  {club.events?.map(event => (
                      <Card
                          key={event.id}
                          date={`${event.date}, ${event.time}`}
                          name={event.name}
                          image={event.source?.[0] || ''}
                          desc={event.description}
                          tagIcon={geoIcon}
                          tagLabel={`${event.city} ${event.location}`}
                          className={c.club_event}
                          onClick={() => {
                            navigate(`/events/event/${event.id}`)
                            setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 100)
                          }}
                      />
                  ))}
                </div>
            </section>
            <section className={`section ${c.feed}`}>
                <div className="section__header">
                    <h2 className="section__title">Лента клуба</h2>
                    <div className="section__counter">{posts.all.length}</div>
                </div>
                <div className={`section__body`}>
                    <Wall
                        type="club"
                        posts={posts}
                        clubId={club.id}
                    />
                </div>
            </section>
        </div>
    )
}

export default SingleClubPage
