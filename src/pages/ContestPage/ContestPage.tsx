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
    const [topParticipants, setTopParticipants] = useState([]);
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

    const timeMap = {
        'days': 'дней',
        'hours': 'часов',
        'minutes': 'минут'
      }


    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [contest]);

    useEffect(() => {
        if (user.contests?.find(item => item.id === Number(contestId))) {
            setParticipating(true);
        }
    }, [user, contest])

    useEffect(() => {
        console.log(participating);
    }, [participating])

    useEffect(() => {
        if (contest) {
            setTopParticipants(contest.participants.filter(participant =>
                contest.prizes.some(prize => prize.client_id === participant.client.id)
            ).sort((a, b) => {
                    const prizeA = contest.prizes.find(prize => prize.client_id === a.client.id);
                    const prizeB = contest.prizes.find(prize => prize.client_id === b.client.id);
                    return prizeA.place - prizeB.place;
                }))
        }
    }, [contest])

    useEffect(() => {
        if (contestStatus === 'idle') {
            dispatch(fetchContests());
        }
    }, [contestStatus, dispatch]);

    if (contestStatus === 'loading' || !contest) {
        return <p>Loading...</p>;
    }

    if (contestStatus === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className={`page`}>
        <div className={`${styles.contestPage}`}>
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
                            {contest?.status === 1 ? (
                                <div className='orange_button'>
                                    Идёт приём работ
                                </div>
                            ) : (
                                <div className='gray_button'>
                                    Завершён
                                </div>
                            )}
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
                                    contest.prizes.map((prize: any) => (
                                        <p key={prize.id}>
                                            {prize.reward}
                                        </p>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {(participating === false) && (contest.status === 1) && (
                <div className={styles.grayPart}>
                    <Link to={`/contests/${contestId}/form`}>
                        <div className='action_button'>
                            Принять участие
                        </div>
                    </Link>
                </div>
            )}
        </div>
            {
                (participating || contest.status === 0) && (
                    <>
                        <div className={`section ${styles.results}`}>
                            <div className='section__header'>
                                <div className='section__title'>Результаты</div>
                            </div>
                            <div className='section_body'>
                                {participating && contest.status === 1 && (
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
                                                    {Object.keys(timeLeft).map((timeItem, index, arr) => {
                                                        if (index !== arr.length - 1)
                                                            return (
                                                                <React.Fragment key={timeItem}>
                                                                    <div className={styles.timerItem}>
                                                                        <div className={styles.timerItem_value}>{timeLeft[timeItem]}</div>
                                                                        <div className={styles.timerItem_label}>{timeMap[timeItem]}</div>
                                                                    </div>
                                                                    <div className={styles.timerSeparator}></div>
                                                                </React.Fragment>
                                                            )
                                                        return (
                                                            <div key={timeItem} className={styles.timerItem}>
                                                                <div className={styles.timerItem_value}>{timeLeft[timeItem]}</div>
                                                                <div className={styles.timerItem_label}>{timeMap[timeItem]}</div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.results_content_rightPart}>
                                            <img src={resultsDragon} alt=""/>
                                        </div>
                                    </div>
                                )}
                                {contest.status === 0 && topParticipants.length > 0 && (
                                    <div className={`shadowBlock ${styles.results_content} ${styles.prizes_content}`}>
                                        {topParticipants.slice(0, 3).map((member, index) => (
                                            <Link to={`/user/${member.client.id}`}>
                                                <div className={styles.prizes_content_block}>
                                                    <div className={styles.prizes_content_block_left}>
                                                        <div className={styles.prizes_content_block_avatar}>
                                                            <img src={member.client.image} alt=""/>
                                                        </div>
                                                        <div className={styles.prizes_content_block_info}>
                                                            <div className={styles.prizes_content_block_info_name}>
                                                                {member.client.name} {member.client.surname}
                                                            </div>
                                                            <div className={styles.prizes_content_block_info_level}>
                                                                <div>
                                                                    Уровень <span>{member.client.level}</span>
                                                                </div>
                                                                <div>
                                                                    Очков <span>{member.client.score}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={styles.prizes_content_block_place}
                                                        style={{
                                                            backgroundColor: index === 0 ? '#FFE500' :
                                                                index === 1 ? '#BAB9B6' :
                                                                    index === 2 ? '#FF9A51' :
                                                                        'gray' // цвет по умолчанию для остальных
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`section ${styles.participants}`}>
                            <div className='section__header'>
                                <div className='section__title'>Участники</div>
                                <div className='section__counter'>{contest.participants.length}</div>
                            </div>
                            <div className='section__body'>
                                <div className={styles.participants_content}>
                                    {contest && contest.participants
                                        .slice(0, 20)
                                        .map(participant => (
                                            <Link to={`/user/${participant.id}`}>
                                                <ActiveUserCard
                                                    image={participant.client.image}
                                                    name={participant.client.name}
                                                    level={participant.client.level}
                                                    points={participant.client.score}
                                                    key={participant.id}></ActiveUserCard>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default ContestPage;
