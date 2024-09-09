import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

//@ts-ignore
import Ruby1 from '../../images/first-screen-ruby-1.png';
//@ts-ignore
import Ruby2 from '../../images/first-screen-ruby-2.png';
//@ts-ignore
import Ruby3 from '../../images/first-screen-ruby-3.png';
import orangeZone from '../../images/orange_background.svg';
import buttonArrow from '../../images/svg/button_arrow.svg';
import rubyStore from '../../images/ruby_store.jpg';
import pacan from '../../images/pacan.jpg';

import {AppDispatch, RootState} from "../../store/store";
import {fetchNewsAndNewsBack} from "../../store/newsSlice";
import {fetchContests} from "../../store/contestSlice";
import { fetchClubs } from '../../store/clubsSlice';
import {Contest, News, NewsBack} from "../../types";
import {formatDate, formatDateToDayMonth, parseAndFormatDate} from "../../App";

import styles from '../UnauthorizedMain/UnauthorizedMain.module.scss';
import c from './mainPage.module.scss'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';

import NewsCard from "../../components/NewsCard/NewsCard";
import ActiveUserCard from "../../components/ActiveUserCard/ActiveUserCard";
import PostCard from '../../components/PostCard/PostCard';
import ClubCard from '../../components/ClubCard/ClubCard';
import {fetchPosts} from "../../store/postSlice";
import {fetchPeople} from "../../store/peopleSlice";
import { arrayFromTo, classNames, getMostActiveUsers } from '../../shared/utils'
import {MemoryGame} from "../../components/MemoryGame/MemoryGame";
import kazanorgsintez from '../../images/svg/Казань Оргсинтез.svg';
import neftehim from '../../images/svg/Нижнекамск нефтехим.svg';
import { User } from '../../store/userSlice'
import NotificationFriends from "../../components/Notification/NotificationFriends";
import NotificationChat from "../../components/Notification/NotificationChat";

const sponsors = [
    kazanorgsintez, neftehim
]

function normalizeDate(dateStr) {
    if (dateStr.includes('.')) {
        // Если дата в формате "23.08.2024 21:59:43"
        const [day, month, yearTime] = dateStr.split('.');
        const [year, time] = yearTime.split(' ');
        return new Date(`${year}-${month}-${day}T${time || '00:00:00'}`);
    } else {
        // Если дата в формате "2024-03-12"
        return new Date(dateStr);
    }
}

const MainPage: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { news } = useSelector((state: RootState) => state.news);
    const { contestStatus, contests } = useSelector((state: RootState) => state.contests)
    const { posts } = useSelector((state: RootState) => state.post)
    const { people } = useSelector((state: RootState) => state.people)
    const {status: clubStatus, clubs } = useSelector((state: RootState) => state.clubs);
    const user = useSelector((state: RootState) => state.user.user);

    const isAuth = !!user?.email_confirmed

    useEffect(() => {
        if (clubStatus === 'idle') {
            dispatch(fetchClubs());
        }
    }, [isAuth, clubStatus, dispatch]);

    useEffect(() => {
        dispatch(fetchNewsAndNewsBack());
    }, [isAuth, dispatch]);

    useEffect(() => {
        if (contestStatus === 'idle') {
            dispatch(fetchContests());
        }
    }, [isAuth, contestStatus, dispatch])

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchPeople())
    }, [])

    const sortedNews = news.slice().sort((a, b) => {
        // @ts-ignore
        const dateA = a.createdAt ? normalizeDate(a.createdAt) : normalizeDate(a.date);
        // @ts-ignore
        const dateB = b.createdAt ? normalizeDate(b.createdAt) : normalizeDate(b.date);
        // @ts-ignore
        return dateB - dateA;
    });


    return (
        <div className={styles.main}>
            {isAuth
            ?
              <div className='content'>
                <div className={classNames(styles.greenZone, c.authorized_hellow_section)}>
                    <div className={styles.greenZone_leftPart}>
                        <div className={styles.greenZone_text}>
                            <h1>
                              Привет, {user.name}!
                            </h1>
                            <p>
                            Читай последние новости, находи новых друзей и единомышленников, участвуй в крутых конкурсах, пиши о том, что тебя волнует, и развивайся вместе с "Рубином".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            :
            <FirstScreenSlider />
            }
            <section className={classNames(
              'section',
              'section--big',
              'section--orange',
              'section--vector-bg',
              styles.news,
              c.section_big
            )}>
                <div className='section__header'>
                    <h2 className={`${styles.news__title} section__title`}>Новости</h2>
                    <Link to="/news">
                        <div className="button button--white"><span>Показать все</span></div>
                    </Link>
                </div>
                <div className="section__body">
                    <div className={classNames('section__slider', c.news_slider)}>
                        {
                            news.length
                            ? (
                                <>
                                    <Swiper
                                        spaceBetween={20}
                                        modules={[Navigation]}
                                        breakpoints={{
                                          1200: {
                                            slidesPerView: 3
                                          },
                                          760: {
                                            slidesPerView: 2
                                          },
                                          360: {
                                            slidesPerView: 1
                                          }
                                        }}
                                        navigation={{
                                            nextEl: '.button--next'
                                        }}
                                    >
                                        {sortedNews.map((newsItem, index) => {
                                            // Проверяем, есть ли у newsItem свойство imagePreviewResized
                                            if ('imagePreviewResized' in newsItem) {
                                                // Теперь TypeScript знает, что newsItem имеет тип News
                                                return (
                                                    <SwiperSlide key={newsItem.id}>
                                                        <Link to={`/news/api/${newsItem.id}`}>
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

            <section className={`section section--big section--rounded ${styles.contests} ${c.section_big}`}>
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
                                        <div className={`justify_content_SB gap-20 ${styles.btns_wrapper}`}>
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
                                            <div className={`action_button ${styles.action_button}`} style={{marginTop: 'auto'}}>
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

            <section className={`section section--big section--green section--vector-bg ${styles.blog} ${c.section_big}`}>
                <div className='section__header'>
                    <h2 className={`${styles.blog__title} section__title`}>Пользовательские записи</h2>
                    <Link to='/posts'>
                        <div className="button button--white">
                            <span>Показать все</span>
                        </div>
                    </Link>
                </div>
                <div className="section__body">
                    <div className="section__slider">
                        <Swiper
                            spaceBetween={20}
                            breakpoints={{
                              1200: {
                                slidesPerView: 3
                              },
                              760: {
                                slidesPerView: 2
                              },
                              360: {
                                slidesPerView: 1
                              }
                            }}
                            modules={[Navigation]}
                            navigation={{
                                nextEl: '.button--next'
                            }}
                        >
                            {posts.image.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <PostCard text={item.title} image={item.source[0]} created_at={item.created_at} client={item.client}/>
                                </SwiperSlide>
                            ))}
                            {/*{[*/}
                            {/*    { text: 'Футбольный клуб "Рубин" — это не просто команда, это целая история, наполненная триумфами, испытаниями и великими победами. В этой записи я расскажу вам о том, как начинался путь "Рубина" и как клуб стал тем, кем он является сегодня.', image: "/images/post-card-01.png" },*/}
                            {/*    { text: 'Успех на футбольном поле начинается с упорной работы на тренировках. В этом блоге мы расскажем вам, как проходят тренировки в нашем клубе и какие методы мы используем для подготовки наших игроков к матчам.', image: "/images/post-card-02.png"},*/}
                            {/*].map((item, index) => (*/}
                            {/*    <SwiperSlide key={index}>*/}
                            {/*        <PostCard text={item.text} image={item.image} />*/}
                            {/*    </SwiperSlide>*/}
                            {/*))}*/}
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

            <section className={`section section--big section--rounded ${styles.novetly} ${c.section_big}`}>
                <div className={styles.rubyStore}>
                    <div className={styles.rubyStore_leftPart}>
                        <div className={styles.rubyStore_leftPart_content}>
                            <h2>
                                Новинки магазина клуба “Рубин”
                            </h2>
                            <Link to='https://store.rubin-kazan.ru/' target='_blank'>
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

            <section className={`section section--big section--orange section--vector-bg ${styles.users} ${c.section_big}`}>
                <div className="section__header">
                    <h2 className={`section__title ${styles.users__title}`}>Активные пользователи</h2>
                    <Link to='/people'>
                        <div className="button button--white">
                            <span>Показать все</span>
                        </div>
                    </Link>
                </div>
                <div className="section__body">
                    <div className={styles.users__content}>
                        {getMostActiveUsers(people, 5).map(item => (
                        <ActiveUserCard key={item.id} image={item.avatar} name={item.name} surname={item.surname} points={item.rubick}/>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`section section--big section--rounded ${styles.activities} ${styles.contestZone} ${c.section_big}`}>
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

            <section className={`section section--big section--green section--vector-bg ${styles.clubs} ${c.section_big}`}>
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
                                    breakpoints={{
                                      1200: {
                                        slidesPerView: 3
                                      },
                                      760: {
                                        slidesPerView: 2
                                      },
                                      360: {
                                        slidesPerView: 1
                                      }
                                    }}
                                    modules={[Navigation]}
                                    navigation={{
                                        nextEl: '.button--next'
                                    }}
                                >
                                    {clubs.map((club, index) => (
                                        <SwiperSlide key={club.name + index}>
                                            <Link to={`/clubs/${club.id}`}>
                                                <ClubCard
                                                  id={club.id}
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
            <section className={`section section--big section--rounded ${styles.sponsors} ${styles.contestZone} ${c.section_big}`}>
                <div className="section__header">
                    <h2 className="section__title">Наши спонсоры</h2>
                </div>
                <div className="section__body">
                    <div className={styles.sponsors__row}>
                        {sponsors.map((item => (
                            <div key={item} className={styles.sponsors__sponsor}>
                                <img src={item} alt="" />
                            </div>
                        )))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const FirstScreenSlider = () => {

  const [slide, setSlide] = useState(1)

  useEffect(() => {
    
    const timer = setInterval(() => {
      setSlide(prev => {
        if ( prev === 3 ) return 1
        return ++prev
      })
    }, 3000)

    return () => clearInterval(timer)
    
  }, [])

  return (
    <div className={classNames('content', c.slider)}>

      <div className={c.pagination} >
        {arrayFromTo(1, 3).map(num => (
          <span className={num === slide ? c._active : ''} ></span>
        ))}
      </div>

      <Slide
        active={slide === 1}
        title='Добро пожаловать в команду!'
        text='Наш клуб — место, где каждый ребёнок находит игру, друзей и развивает свои таланты.'
        img={Ruby1}
        color='green'
        button={{ text: 'Присоединиться к клубу', link: '/login' }}
      />

      <Slide
        active={slide === 2}
        title='Твой спортивный путь начинается здесь!'
        text='Следи за своими достижениями и улучшай результаты с персональным спортивным дневником клуба "Рубин". Фиксируй тренировки, отслеживай прогресс и ставь новые цели!'
        img={Ruby2}
        color='yellow'
        button={{ text: 'Перейти к книге', link: '/' }}
      />

      <Slide
        active={slide === 3}
        title='Воплоти мечты в реальность!'
        text='Открой новый уровень футбольных эмоций с приложением дополненной реальности FC Rubin AR! Взаимодействуй с виртуальными элементами, узнавай больше о любимой команде и почувствуй себя частью футбольной семьи "Рубин"'
        img={Ruby3}
        color='red'
        button={{ text: 'Скачать приложение FC Rubin AR', link: '/download-app' }}
      />

  </div>
  )
}

interface SlideProps {
  active: boolean
  title: string
  text: string
  img: string
  color: 'green' | 'red' | 'yellow'
  button: { text: string, link: string }
}
const Slide = ({ active, title, text, img, color, button }: SlideProps) => {

  const navigate = useNavigate()

  return (
    <div className={classNames(c.slide, c[color], active ? c._active : '')}>
      <div className={c.left}>
        <div className={c.text_wrapper}>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
        <button className='white_button' onClick={() => navigate(button.link)} >
          {button.text}
        </button>
      </div>
      <div className={c.right}>
        <img src={img} />
      </div>
    </div>
  )
}

export default MainPage;
