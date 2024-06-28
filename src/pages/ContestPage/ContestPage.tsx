import React, {useEffect} from 'react';
import styles from './ContestPage.module.scss';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchContests} from "../../store/contestSlice";
import {Contest} from "../../types";
import {formatDate} from "../../App";
import info from '../../images/svg/akar-icons_info-fill.svg';
import trophy from '../../images/svg/healthicons_award-trophy.svg';

const ContestPage = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { contestId } = useParams();

    const { contests, contestStatus, error } = useSelector((state: RootState) => state.contests);

    const contest: Contest | undefined = contests.find(contest => contest.id.toString() === contestId);


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
                                        <p>
                                            {prize}
                                        </p>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.grayPart}>
                <Link to={`/contests/${contestId}/form`}>
                    <div className='action_button'>
                        Принять участие
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ContestPage;