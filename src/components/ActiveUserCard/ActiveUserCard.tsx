import React from 'react';
import styles from './ActiveUserCard.module.scss';

interface ActiveUserProps {
    image: string;
    name: string;
    surname: string;
    points: number
}

const ActiveUserCard = ({image, name, surname, points}: ActiveUserProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.card_image}>
                <img src={image} alt=""/>
            </div>
            <div className={styles.card_info}>
                <div className={styles.card_info_name}>
                    {name} {surname}
                </div>
                <div className={styles.card_info_numbers}>
                    {/* <div className={styles.numbersBlock}>
                        <span>Уровень</span>
                        <div>
                            {level}
                        </div>
                    </div> */}
                    <div className={styles.numbersBlock}>
                        <span>Рубиков</span>
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
