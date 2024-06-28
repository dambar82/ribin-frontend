import React, {useEffect, useState} from 'react';
import styles from './UnauthorizedMain.module.scss';
import drakon from '../../images/svg/Drakon.svg';
import orangeZone from '../../images/orange_background.svg';
import buttonArrow from '../../images/svg/button_arrow.svg';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchNews} from "../../store/newsSlice";
import {Contest, News} from "../../types";
import {formatDate} from "../../App";
import {fetchContests} from "../../store/contestSlice";

const UnauthorizedMain: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { status, news } = useSelector((state: RootState) => state.news);
    const { contestStatus, contests } = useSelector((state: RootState) => state.contests)

    const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
    const [newsFetched, setNewsFetched] = useState<News[]>([]);
    const [contestsFetched, setContestsFetched] = useState<Contest[]>([])

    const handleNext = (): void => {
        const nextIndex = currentNewsIndex + 3 < newsFetched.length ? currentNewsIndex + 3 : 0;
        setCurrentNewsIndex(nextIndex);
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNews());
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
                        {displayNews.map((item: News) => (
                            <Link to='/news' key={item.id}>
                                <div
                                    className={`newsBlock`}
                                    style={{ backgroundImage: `url(${item.images[0]})` }}
                                >
                                    <div className={`newsBlock_header`}>
                                        <div className={`newsBlock_date`}>
                                            {formatDate(item.date).replace(/\d{4}$/, '')}
                                        </div>
                                    </div>
                                    <div className={`newsBlock_footer`}>
                                        {item.title}
                                    </div>
                                </div>
                            </Link>
                        ))}
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
                                            {contestsFetched[0]?.name}
                                        </h2>
                                        <p>
                                            {contestsFetched[0]?.short_description}
                                        </p>
                                    </div>
                                    <div className='justify_content_SB gap-20'>
                                        <div className='start_button start_button-green'>
                                            <span>Старт</span>
                                            <div>
                                                {formatDate(contestsFetched[0]?.start_date)}
                                            </div>
                                        </div>
                                        <div className='start_button start_button-red'>
                                            <span>Конец</span>
                                            <div>
                                                {formatDate(contestsFetched[0]?.end_date)}
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/contests/${contestsFetched[0].id}`}>
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
        </div>
    );
};

export default UnauthorizedMain;