import { useState } from 'react'
import styles from './SingleClubPage.module.scss';

import loupeIcon from '../../images/svg/loupe.svg'
import geoIcon from '../../images/svg/geo.svg'

import Row from '../../components/Row/Row';
import Card from '../../components/Card/Card';
import Post from '../../components/Post/Post';

const SingleClubPage = () => {
    const [feedType, setFeedType] = useState(0)
    const [sortType, setSortType] = useState(0)
    
    return (
        <div className='page'>
            <section className={`section ${styles.clubInfo}`}>
                <div className={styles.clubInfo__image}>
                    <img src="/images/club-cover.png" alt="" />
                </div>
                <div className={styles.clubInfo__content}>
                    <div className={styles.clubInfo__avatar}>
                        <img src="/images/club-avatar.png" alt="" />
                    </div>
                    <div className={styles.clubInfo__info}>
                        <div className={styles.clubInfo__infoHeader}>
                            <div>
                                <h1 className={styles.clubInfo__title}>Фитнес-клуб "Футбол и здоровье"</h1>
                                <div className={styles.clubInfo__level}>Уровень 200</div>
                            </div>
                            <button className="button button--main" type="button">
                                <span>Вступить в Клуб</span>    
                            </button>
                        </div>
                        <div className={styles.clubInfo__infoDesc}>
                            <p>Клуб для тех, кто хочет улучшить свою физическую форму через футбольные тренировки. Включает кардиотренировки, специальные упражнения и футбольные игры. Также проводятся занятия по правильному питанию и общему укреплению здоровья.</p>
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
                <div className={`${styles.feed__body} section__body`}>
                    <nav className={styles.feed__nav}>
                        {["Записи", "Комментарии", "Видео", "Фотографии"].map((item, index) => (
                            <button 
                                key={item + index}
                                className={feedType !== index ? styles.feed__navButton : `${styles.feed__navButton} ${styles.feed__navButtonActive}`} 
                                type="button"
                                onClick={() => setFeedType(index)}
                            >
                                <span>{item}</span>
                            </button>
                        ))}
                    </nav>
                    <div className={styles.feed__content}>
                        <Post
                            name='Фитнес-клуб "Футбол и здоровье"'
                            image="/images/post-01.png"
                            tags="#ФутболИЗдоровье #Фитнес"
                            comments={[]}
                        >
                            <p>Добро пожаловать в "Фитнес-клуб "Футбол и здоровье"! ⚽️ У нас вы найдете:</p>
                            <ul>
                                <li>Современное оборудование.</li>
                                <li>Опытных тренеров.</li>
                                <li>Уютную атмосферу.</li>
                            </ul>
                            <p>Присоединяйтесь и улучшайте свою физическую форму вместе с нами!</p>
                        </Post>
                        <Post
                            name='Фитнес-клуб "Футбол и здоровье"'
                            tags='#ФутболИЗдоровье #Тренировки #Мотивация'
                            image=''
                            comments={[
                                { avatar: '/images/comment-author-01.png', author: 'Вячеслав Бустренко' },
                                { avatar: '/images/comment-author-02.png', author: 'Инсаф Ло' },
                                { avatar: '/images/comment-author-03.png', author: 'Екатерина Зуева' }
                            ]}
                        >
                            <p>Великие игроки не рождаются - они становятся такими благодаря упорству и тренировкам. Присоединяйтесь к нам в "Фитнес-клубе "Футбол и здоровье" и начните свой путь к успеху уже сегодня! 🏆</p>
                        </Post>
                        <Post
                            name='Фитнес-клуб "Футбол и здоровье"'
                            tags='#ФутболИЗдоровье #ТренировкаНедели'
                            image='/images/post-02.png'
                            comments={[]}
                        >
                            <p>Не пропустите! В эту субботу в 10:00 в нашем клубе пройдет мастер-класс по технике удара от профессионального тренера. Участвуйте и получите ценные советы и навыки. Запись обязательна!</p>
                        </Post>
                    </div>
                    <aside className={styles.feed__aside}>
                        <form method="GET" action="#" className={styles.feed__form}>
                            <button type="button">
                                <img src={loupeIcon} alt="" />
                            </button>
                            <input type="text" placeholder='Поиск'/>
                        </form>
                        <div className={styles.feed__filter}>
                            {["Популярное", "Новое", "Старое"].map((item, index) => (
                                <button 
                                    key={item + index}
                                    className={sortType === index ? `${styles.feed__filterItem} ${styles.feed__filterItemActive}` : styles.feed__filterItem} 
                                    type="button"
                                    onClick={() => setSortType(index)}
                                >{item}</button>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default SingleClubPage;