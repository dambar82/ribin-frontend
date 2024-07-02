import React from 'react';
import styles from './ActiveUserCard.module.scss';

interface ActiveUserProps {
    image: string;
    name: string;
    level: number;
    points: number
}

const ActiveUserCard = ({image, name, level, points}: ActiveUserProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.card_image}>
                <img src={image} alt=""/>
            </div>
            <div className={styles.card_info}>
                <div className={styles.card_info_name}>
                    {name}
                </div>
                <div className={styles.card_info_numbers}>
                    <div className={styles.numbersBlock}>
                        <span>Уровень</span>
                        <div>
                            {level}
                        </div>
                    </div>
                    <div className={styles.numbersBlock}>
                        <span>Очков</span>
                        <div>
                            {points}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveUserCard;
