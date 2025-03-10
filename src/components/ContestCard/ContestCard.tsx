import styles from './ContestCard.module.scss';
import React from 'react';
import {formatDate} from "../../App";

interface IContestCard {
    title: string;
    image: string;
    status: number;
    short_description: string;
    start_date: string;
    end_date: string
}

const ContestCard = ({title, image, status, short_description, start_date, end_date}: IContestCard) => {
    return (
        <div className={status === 1 ? styles.card : `${styles.card} ${styles.card_gray}`}>
            <div className={styles.card_image}>
                {image && <img src={image} alt=""/>}
            </div>
            <div className={styles.card__right}>
                <div className={`${styles.card__right_header} justify_content_SB`}>
                    <h3>
                        {title}
                    </h3>
                    {status === 1 ? (
                        <div className='orange_button'>Активен</div>
                    ) : status === 2 ? (
                        <div className='gray_button'>Завершён</div>
                    ) : (
                        <div className='orange_button'>Подведение итогов</div>
                    )}
                </div>
                <div className={styles.card__right_content}>
                    <p>
                        {short_description}
                    </p>
                    {status === 1 ? (
                        <div className={`${styles.dates}`}>
                            <div className='start_button start_button-green'>
                                <span>Старт</span>
                                <div>
                                    {formatDate(start_date)}
                                </div>
                            </div>
                            <div className='start_button start_button-red'>
                                <span>Конец</span>
                                <div>
                                    {formatDate(end_date)}
                                </div>
                            </div>
                        </div>
                    ) : ''
                    }
                </div>
            </div>
        </div>
    );
};

export default ContestCard;