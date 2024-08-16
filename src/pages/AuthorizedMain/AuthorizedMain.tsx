import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import drakon from '../../images/svg/Drakon.svg';
import orangeZone from '../../images/orange_background.svg';
import buttonArrow from '../../images/svg/button_arrow.svg';
import sponsor from '../../images/svg/sponsor.svg'
import rubyStore from '../../images/ruby_store.jpg';
import pacan from '../../images/pacan.jpg';

import {AppDispatch, RootState} from "../../store/store";
import {fetchNewsAndNewsBack} from "../../store/newsSlice";
import {fetchContests} from "../../store/contestSlice";
import { fetchClubs } from '../../store/clubsSlice';
import {Contest, News, NewsBack} from "../../types";
import {formatDate, formatDateToDayMonth, parseAndFormatDate} from "../../App";

import styles from '../UnauthorizedMain/UnauthorizedMain.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';

import NewsCard from "../../components/NewsCard/NewsCard";
import ActiveUserCard from "../../components/ActiveUserCard/ActiveUserCard";
import PostCard from '../../components/PostCard/PostCard';
import ClubCard from '../../components/ClubCard/ClubCard';

const AuthorizedMain: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { status, news } = useSelector((state: RootState) => state.news);
    const { contestStatus, contests } = useSelector((state: RootState) => state.contests)
    const {status: clubStatus, clubs } = useSelector((state: RootState) => state.clubs);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchClubs());
        }
    }, [status, dispatch]);
    // const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
    // const [newsFetched, setNewsFetched] = useState<(News | NewsBack)[]>([]);
    // const [contestsFetched, setContestsFetched] = useState<Contest[]>([])

    // const handleNext = (): void => {
    //     const nextIndex = currentNewsIndex + 3 < newsFetched.length ? currentNewsIndex + 3 : 0;
    //     setCurrentNewsIndex(nextIndex);
    // };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNewsAndNewsBack());
        }
    }, [status, dispatch]);

    // useEffect(() => {
    //     setNewsFetched(news);
    // }, [news])

    useEffect(() => {
        if (contestStatus === 'idle') {
            dispatch(fetchContests());
        }
    }, [contestStatus, dispatch])

    useEffect(() => {
        if (clubStatus === 'idle') {
            dispatch(fetchClubs());
        }
    }, [clubStatus, dispatch])

    // useEffect(() => {
    //     setContestsFetched(contests);
    // }, [contests])

    return (
        <div className={styles.main}>
            <div className='content'>
                <div className={styles.greenZone}>
                    <div className={styles.greenZone_leftPart}>
                        <div className={styles.greenZone_text}>
                            <h1>
                                Добро пожаловать в команду!
                            </h1>
                            <p>
                                Наш клуб — место, где каждый ребёнок находит игру, друзей и развивает свои таланты.
                            </p>
                        </div>
                        <div className='white_button'>
                            Присоединиться к клубу
                        </div>
                    </div>
                    <div className={styles.greenZone_rightPart}>
                        <img src={drakon} alt=""/>
                    </div>
                </div>
            </div>
            <section className={`section section--big section--orange section--vector-bg ${styles.news}`}>
                <div className='section__header'>
                    <h2 className={`${styles.news__title} section__title`}>Новости</h2>
                    <Link to="/news">
                        <div className="button button--white"><span>Показать все</span></div>
                    </Link>
                </div>
                <div className="section__body">
                    <div className="section__slider">
                        {
                            news.length
                            ? (
                                <>
                                    <Swiper
                                        spaceBetween={20}
                                        slidesPerView={3}
                                        modules={[Navigation]}
                                        navigation={{
                                            nextEl: '.button--next'
                                        }}
                                    >
                                        {news.map((newsItem, index) => {
                                            // Проверяем, есть ли у newsItem свойство imagePreviewResized
                                            if ('imagePreviewResized' in newsItem) {
                                                // Теперь TypeScript знает, что newsItem имеет тип News
                                                return (
                                                    <SwiperSlide key={newsItem.id}>
                                                        <Link to={newsItem.url} target="_blank" rel="noopener noreferrer">
                                                            <NewsCard
                                                                title={newsItem.title}
                                                                date={newsItem.publishDate}
                                                                image={newsItem.imagePreviewResized}
                                                                newsBack={false}
                                                            />
                                                        </Link>
                                                    </SwiperSlide>
                                                );
                                            } else {
                                                // Здесь newsItem обрабатывается как NewsBack
                                                return (
                                                    <SwiperSlide key={newsItem.id}>
                                                        <Link to={`/news/${newsItem.id}`}>
                                                            <NewsCard
                                                                date={newsItem.date}
                                                                image={newsItem.images[0]}
                                                                title={newsItem.title}
                                                                newsBack={true}
                                                            />
                                                        </Link>
                                                    </SwiperSlide>
                                                );
                                            }
                                        })}
                                    </Swiper>
                                    <div className="section__sliderControls">
                                        <button className="button button--black button--next" type="button">
                                            <span>Вперед</span>
                                            <img src={buttonArrow} alt="" />
                                        </button>
                                    </div>
                                </>
                            ) : null
                        }
                    </div>
                </div>
            </section>

            <section className={`section section--big section--rounded ${styles.contests}`}>
                <div className={`section__header`}>
                    <h2 className={`${styles.contests__title} section__title`}>Конкурсы</h2>
                    <Link to='/contests'>
                        <div className="button button--black"><span>Показать все</span></div>
                    </Link>
                </div>
                <div className="section__body">
                    {
                        contests[0] && (
                            <div className={styles.contests__content}>
                                <div className={styles.contestZone_card}>
                                    <div className={styles.contestZone_card_leftPart}>
                                        <div className={styles.contestZone_card_text}>
                                            <h2>
                                                {contests[0].name}
                                            </h2>
                                            <p>
                                                {contests[0].short_description}
                                            </p>
                                        </div>
                                        <div className='justify_content_SB gap-20'>
                                            <div className='start_button start_button-green'>
                                                <span>Старт</span>
                                                <div>
                                                    {formatDate(contests[0].start_date)}
                                                </div>
                                            </div>
                                            <div className='start_button start_button-red'>
                                                <span>Конец</span>
                                                <div>
                                                    {formatDate(contests[0].end_date)}
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/contests/${contests[0].id}`} style={{marginTop: 'auto'}}>
                                            <div className='action_button' style={{marginTop: 'auto'}}>
                                                Участвовать
                                                <img src={buttonArrow} alt=""/>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className={styles.contestZone_card_rightPart}>
                                        <img src={contests[0]?.source} alt=""/>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
            </section>

            <section className={`section section--big section--green section--vector-bg ${styles.blog}`}>
                <div className='section__header'>
                    <h2 className={`${styles.blog__title} section__title`}>Пользовательские записи</h2>
                    <Link to='/blogs'>
                        <div className="button button--white">
                            <span>Показать все</span>
                        </div>
                    </Link>
                </div>
                <div className="section__body">
                    <div className="section__slider">
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={3}
                            modules={[Navigation]}
                            navigation={{
                                nextEl: '.button--next'
                            }}
                        >
                            {[
                                { text: 'Футбольный клуб "Рубин" — это не просто команда, это целая история, наполненная триумфами, испытаниями и великими победами. В этой записи я расскажу вам о том, как начинался путь "Рубина" и как клуб стал тем, кем он является сегодня.', image: "/images/post-card-01.png" },
                                { text: 'Успех на футбольном поле начинается с упорной работы на тренировках. В этом блоге мы расскажем вам, как проходят тренировки в нашем клубе и какие методы мы используем для подготовки наших игроков к матчам.', image: "/images/post-card-02.png"},
                            ].map((item, index) => (
                                <SwiperSlide key={index}>
                                    <PostCard text={item.text} image={item.image} />
                                </SwiperSlide>
                            ))}
                            {[
                                { text: 'Футбольный клуб "Рубин" — это не просто команда, это целая история, наполненная триумфами, испытаниями и великими победами. В этой записи я расскажу вам о том, как начинался путь "Рубина" и как клуб стал тем, кем он является сегодня.', image: "/images/post-card-01.png" },
                                { text: 'Успех на футбольном поле начинается с упорной работы на тренировках. В этом блоге мы расскажем вам, как проходят тренировки в нашем клубе и какие методы мы используем для подготовки наших игроков к матчам.', image: "/images/post-card-02.png"},
                            ].map((item, index) => (
                                <SwiperSlide key={index}>
                                    <PostCard text={item.text} image={item.image} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="section__sliderControls">
                            <button className="button button--black button--next" type="button">
                                <span>Вперед</span>
                                <img src={buttonArrow} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`section section--big section--rounded ${styles.novetly}`}>
                <div className={styles.rubyStore}>
                    <div className={styles.rubyStore_leftPart}>
                        <div className={styles.rubyStore_leftPart_content}>
                            <h2>
                                Новинки магазина клуба “Рубин”
                            </h2>
                            <Link to='/store'>
                                <div className='action_button'>
                                    Перейти
                                    <img src={buttonArrow} alt=""/>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.rubyStore_rightPart}>
                        <img src={rubyStore} alt=""/>
                    </div>
                </div>
            </section>

            <section className={`section section--big section--orange section--vector-bg ${styles.users}`}>
                <div className="section__header">
                    <h2 className={`section__title ${styles.users__title}`}>Активные пользователи</h2>
                    <Link to='/blogs'>
                        <div className="button button--white">
                            <span>Показать все</span>
                        </div>
                    </Link>
                </div>
                <div className="section__body">
                    <div className={styles.users__content}>
                        {[1, 2, 3, 4, 5].map(item => (
                            <ActiveUserCard key={item} image={pacan} name={'Дмитрий Иванов'} level={25} points={2000}/>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`section section--big section--rounded ${styles.activities} ${styles.contestZone}`}>
                <div className='section__header'>
                    <h2 className='section__title'>Активности клуба</h2>
                </div>
                <div className='section__body'>
                    <div className={styles.activities__content}>
                        <div className={styles.activities__card}>
                            <Link to="/sportslife">
                                <div className={styles.activities__cardImage}>
                                    <img src="images/dragonball.png" alt="" />
                                </div>
                                <div className={styles.activities__cardName}>Спорт для школьников</div>
                            </Link>
                        </div>
                        <div className={styles.activities__card}>
                            <Link to="/quizzes">
                                <div className={styles.activities__cardImage}>
                                    <img src="images/dragonquiz.png" alt="" />
                                </div>
                                <div className={styles.activities__cardName}>Викторины</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`section section--big section--green section--vector-bg ${styles.clubs}`}>
                <div className="section__header">
                    <h2 className={`section__title ${styles.clubs__title}`}>Клубы</h2>
                    <Link to='/clubs'>
                        <div className="button button--white">
                            <span>Показать все</span>
                        </div>
                    </Link>
                </div>
                <div className="section__body">
                    { clubs.length ?
                        (
                            <div className="section__slider">
                                <Swiper
                                    spaceBetween={20}
                                    slidesPerView={3}
                                    modules={[Navigation]}
                                    navigation={{
                                        nextEl: '.button--next'
                                    }}
                                >
                                    {clubs.map((club, index) => (
                                        <SwiperSlide key={club.name + index}>
                                            <Link to={`/clubs/${index}`}>
                                                <ClubCard
                                                    name={club.name}
                                                    image={club.caption}
                                                    desc={club.short_description}
                                                    participants={club.clients_count}
                                                />
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="section__sliderControls">
                                    <button className="button button--black button--next" type="button">
                                        <span>Вперед</span>
                                        <img src={buttonArrow} alt="" />
                                    </button>
                                </div>
                            </div>
                        ) : null
                    }

                </div>
            </section>
            <section className={`section section--big section--rounded ${styles.sponsors} ${styles.contestZone}`}>
                <div className="section__header">
                    <h2 className="section__title">Наши спонсоры</h2>
                </div>
                <div className="section__body">
                    <div className={styles.sponsors__row}>
                        {[1, 2, 3, 4].map((item => (
                            <div key={item} className={styles.sponsors__sponsor}>
                                <img src={sponsor} alt="" />
                            </div>
                        )))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuthorizedMain;
