import React, {useEffect, useState} from 'react';
import styles from '../UnauthorizedMain/UnauthorizedMain.module.scss';
import drakon from '../../images/svg/Drakon.svg';
import orangeZone from '../../images/orange_background.svg';
import buttonArrow from '../../images/svg/button_arrow.svg';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchNewsAndNewsBack} from "../../store/newsSlice";
import NewsCard from "../../components/NewsCard/NewsCard";
import {Contest, News, NewsBack} from "../../types";
import {formatDate, formatDateToDayMonth, parseAndFormatDate} from "../../App";
import {fetchContests} from "../../store/contestSlice";
import rubyStore from '../../images/ruby_store.jpg';
import ActiveUserCard from "../../components/ActiveUserCard/ActiveUserCard";
import pacan from '../../images/pacan.jpg';
import sponsor from '../../images/svg/sponsor.svg'

const AuthorizedMain: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { status, news } = useSelector((state: RootState) => state.news);
    const { contestStatus, contests } = useSelector((state: RootState) => state.contests)

    const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
    const [newsFetched, setNewsFetched] = useState<(News | NewsBack)[]>([]);
    const [contestsFetched, setContestsFetched] = useState<Contest[]>([])

    const handleNext = (): void => {
        const nextIndex = currentNewsIndex + 3 < newsFetched.length ? currentNewsIndex + 3 : 0;
        setCurrentNewsIndex(nextIndex);
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNewsAndNewsBack());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setNewsFetched(news);
    }, [news])

    useEffect(() => {
        if (contestStatus === 'idle') {
            dispatch(fetchContests());
        }
    }, [contestStatus, dispatch])

    useEffect(() => {
        setContestsFetched(contests);
    }, [contests])

    const displayNews = newsFetched.slice(currentNewsIndex, currentNewsIndex + 3);

    return (
        <div className={styles.main}>
            <div className='content'>
                <div className={styles.greenZone}>
                    <div className={styles.greenZone_leftPart}>
                        <div className={styles.greenZone_text}>
                            <h1>
                                Добро пожаловать  в команду!
                            </h1>
                            <p>
                                Наш клуб — место, где каждый ребёнок находит игру, друзей  и развивает свои таланты.
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
            <div className={styles.orangeZone}>
                <div className={styles.orangeZone_content}>
                    <div className={styles.orangeZone_content_header}>
                        <Link to='/news'>
                            <div className={`white_button_little`}>
                                Показать все
                            </div>
                        </Link>
                    </div>
                    <div className={styles.orangeZone_content_flex}>
                        {
                            displayNews.map((newsItem) => {
                                // Проверяем, есть ли у newsItem свойство imagePreviewResized
                                if ('imagePreviewResized' in newsItem) {
                                    // Теперь TypeScript знает, что newsItem имеет тип News
                                    return (
                                        <Link key={newsItem.id} to={newsItem.url} target="_blank" rel="noopener noreferrer">
                                            <div
                                                className={`newsBlock`}
                                                style={{ backgroundImage: `url(${newsItem.imagePreviewResized})` }}
                                            >
                                                <div className={`newsBlock_header`}>
                                                    <div className={`newsBlock_date`}>
                                                        {formatDateToDayMonth(parseAndFormatDate(newsItem.publishDate))}
                                                    </div>
                                                </div>
                                                <div className={`newsBlock_footer`}>
                                                    {newsItem.title}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                } else {
                                    // Здесь newsItem обрабатывается как NewsBack
                                    return (
                                        <div
                                            className={`newsBlock`}
                                            style={{ backgroundImage: `url(${newsItem.images[0]})` }}
                                        >
                                            <div className={`newsBlock_header`}>
                                                <div className={`newsBlock_date`}>
                                                    {formatDate(newsItem.date)}
                                                </div>
                                            </div>
                                            <div className={`newsBlock_footer`}>
                                                {newsItem.title}
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
                    <div className={styles.orangeZone_content_header}>
                        <div className='action_button' onClick={handleNext}>
                            Вперёд
                            <img src={buttonArrow} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.contestZone}>
                <div className={styles.contestZone_header}>
                    <h2>
                        Конкурсы
                    </h2>
                    <Link to='/contests'>
                        <div className={`black_button_little`}>
                            Показать все
                        </div>
                    </Link>
                </div>
                {
                    contestsFetched[0] && (
                        <div className={styles.contestZone_content}>
                            <div className={styles.contestZone_card}>
                                <div className={styles.contestZone_card_leftPart}>
                                    <div className={styles.contestZone_card_text}>
                                        <h2>
                                            {contestsFetched[0].name}
                                        </h2>
                                        <p>
                                            {contestsFetched[0].short_description}
                                        </p>
                                    </div>
                                    <div className='justify_content_SB gap-20'>
                                        <div className='start_button start_button-green'>
                                            <span>Старт</span>
                                            <div>
                                                {formatDate(contestsFetched[0].start_date)}
                                            </div>
                                        </div>
                                        <div className='start_button start_button-red'>
                                            <span>Конец</span>
                                            <div>
                                                {formatDate(contestsFetched[0].end_date)}
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/contests/${contestsFetched[0].id}`} style={{marginTop: 'auto'}}>
                                        <div className='action_button' style={{marginTop: 'auto'}}>
                                            Участвовать
                                            <img src={buttonArrow} alt=""/>
                                        </div>
                                    </Link>
                                </div>
                                <div className={styles.contestZone_card_rightPart}>
                                    <img src={contestsFetched[0]?.source} alt=""/>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className={styles.blogZone}>
                <div className={styles.orangeZone_content}>
                    <div className={styles.orangeZone_content_header}>
                        <Link to='/blogs'>
                            <div className={`white_button_little`}>
                                Показать все
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.contestZone}>
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
            </div>
            <div className={styles.activeUsersZone}>
                <div className={styles.orangeZone_content}>
                    <div className={styles.orangeZone_content_header}>
                        <Link to='/blogs'>
                            <div className={`white_button_little`}>
                                Показать все
                            </div>
                        </Link>
                    </div>
                    <div className={styles.flexZone}>
                        <ActiveUserCard image={pacan} name={'Дмитрий Иванов'} level={25} points={2000}/>
                        <ActiveUserCard image={pacan} name={'Дмитрий Иванов'} level={25} points={2000}/>
                        <ActiveUserCard image={pacan} name={'Дмитрий Иванов'} level={25} points={2000}/>
                    </div>
                </div>
            </div>
            <div className={styles.contestZone}>
                <div className={styles.contestZone_header}>
                    <h2>
                        Спортивное сообщество
                    </h2>
                </div>
                <div className={styles.sportsCommunity}>
                    <div className={styles.sportsCommunity_block}>
                        <img src='images/drakonball.png' alt=""/>
                        <div>
                            Жизнь спортивного клуба
                        </div>
                    </div>
                    <div className={styles.sportsCommunity_block}>
                        <img src='images/drakonskameika.png' alt=""/>
                        <div>
                            Спорт для школьников
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.clubZone}>
                <div className={styles.orangeZone_content}>
                    <div className={styles.orangeZone_content_header}>
                        <Link to='/clubs'>
                            <div className={`white_button_little`}>
                                Показать все
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.contestZone}>
                <div className={styles.contestZone_header}>
                    <h2>
                        Наши спонсоры
                    </h2>
                </div>
                <div className={styles.sponsorsGrid}>
                    <div className={styles.sponsorBlock}>
                        <img src={sponsor} alt=""/>
                    </div>
                    <div className={styles.sponsorBlock}>
                        <img src={sponsor} alt=""/>
                    </div>
                    <div className={styles.sponsorBlock}>
                        <img src={sponsor} alt=""/>
                    </div>
                    <div className={styles.sponsorBlock}>
                        <img src={sponsor} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorizedMain;
