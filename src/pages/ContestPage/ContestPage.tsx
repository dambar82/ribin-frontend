import React, {useEffect, useState} from 'react';
import styles from './ContestPage.module.scss';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchContests} from "../../store/contestSlice";
import {Contest} from "../../types";
import {formatDate} from "../../App";
import info from '../../images/svg/akar-icons_info-fill.svg';
import trophy from '../../images/svg/healthicons_award-trophy.svg';
import resultsDragon from '../../images/resultsDragon.svg';
import ActiveUserCard from "../../components/ActiveUserCard/ActiveUserCard";

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
};

const defaultTimeLeft: TimeLeft = {
    days: 0,
    hours: 0,
    minutes: 0
};

const ContestPage = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { contestId } = useParams();

    const { contests, contestStatus, error } = useSelector((state: RootState) => state.contests);
    const { user } = useSelector((state: RootState) => state.user);

    const [participating, setParticipating] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(defaultTimeLeft);

    const contest: Contest = contests.find(contest => contest.id.toString() === contestId);

    const calculateTimeLeft = (): TimeLeft => {
        if (!contest) {
            return defaultTimeLeft;
        }

        const difference = +new Date(contest.end_date) - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
            };
        }
        return defaultTimeLeft;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [contest]);

    useEffect(() => {
        if (user.contests.find(item => item.id === Number(contestId))) {
            setParticipating(true);
        }
    }, [user, contest])

    useEffect(() => {
        if (contestStatus === 'idle') {
            dispatch(fetchContests());
        }
    }, [contestStatus, dispatch]);

    if (contestStatus === 'loading') {
        return <p>Loading...</p>;
    }

    if (contestStatus === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <>
        <div className={styles.contestPage}>
            <div className={styles.whitePart}>
                <div className={styles.card}>
                    <div className={styles.card__image}>
                        <img src={contest?.source} alt=""/>
                    </div>
                    <div className={styles.card__right}>
                        <div className={`${styles.card__right_header} justify_content_SB`}>
                            <h3>
                                {contest?.name}
                            </h3>
                            <div className='orange_button'>
                                Идёт приём работ
                            </div>
                        </div>
                        <div className={styles.card__right_footer}>
                            <div className={`${styles.boxShadow} ${styles.datesBlock}`}>
                                <div className={styles.date}>
                                    <div className={styles.date_text}>
                                        Старт
                                    </div>
                                    <div className='start_button_minimized'>
                                        {contest && formatDate(contest.start_date)}
                                    </div>
                                </div>
                                <div className={styles.date}>
                                    <div className={styles.date_text}>
                                        Конец
                                    </div>
                                    <div className='start_button_minimized start_button_minimized-red'>
                                        {contest && formatDate(contest.end_date)}
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles.boxShadow} ${styles.date}`}>
                                <div className={styles.date_text}>
                                    Объявление результатов
                                </div>
                                <div className='start_button_minimized start_button_minimized-blue'>
                                    {contest && formatDate(contest.end_date)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.grayBlocks}>
                    <div className={styles.grayBlock}>
                        <div>
                            <img src={info} alt=""/>
                        </div>
                        <div className={styles.grayBlock_text}>
                            <h3>
                                Описание
                            </h3>
                            <p>
                                {contest?.description}
                            </p>
                        </div>
                    </div>
                    <div className={styles.grayBlock}>
                        <div>
                            <img src={trophy} alt=""/>
                        </div>
                        <div className={styles.grayBlock_text}>
                            <h3>
                                Призы
                            </h3>
                            {
                                contest?.prizes && (
                                    contest.prizes.map((prize: string) => (
                                        <p key={prize}>
                                            {prize}
                                        </p>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {!participating && (
                <div className={styles.grayPart}>
                    <Link to={`/contests/${contestId}/form`}>
                        <div className='action_button'>
                            Принять участие
                        </div>
                    </Link>
                </div>
            )}
        </div>
        {participating && (
            <>
                <div className={`section ${styles.results}`}>
                    <div className='section__header'>
                        <div className='section__title'>Результаты</div>
                    </div>
                    <div className='section_body'>
                        <div className={`shadowBlock ${styles.results_content}`}>
                            <div className={`${styles.results_content_leftPart}`}>
                                <h1>
                                    Поздравляем, ты стал (а) участником конкурса!
                                </h1>
                                <div className={styles.timerBlock}>
                                    <h2>
                                        Осталось времени до оглашения результатов
                                    </h2>
                                    <div className={styles.timerBlock_timer}>
                                        <div>
                                            {timeLeft.days} дней
                                            {timeLeft.hours} часов
                                            {timeLeft.minutes} минут
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.results_content_rightPart}>
                                <img src={resultsDragon} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`section ${styles.participants}`}>
                    <div className='section__header'>
                        <div className='section__title'>Участники</div>
                        <div className='section__counter'>23</div>
                    </div>
                    <div className='section__body'>
                        <div className={styles.participants_content}>
                            {contest && contest.participants
                                .slice(0, 20) // Ограничиваем массив до первых 20 элементов
                                .map(participant => (
                                    <ActiveUserCard
                                        image={participant.client.image}
                                        name={participant.client.name}
                                        level={20}
                                        points={2000}
                                        key={participant.id}></ActiveUserCard>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </>
        )}
        </>
    );
};

export default ContestPage;