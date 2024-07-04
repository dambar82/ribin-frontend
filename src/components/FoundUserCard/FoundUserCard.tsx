import React from 'react';
import styles from './FoundUserCard.module.scss';

interface FoundUserCardProps {
    image: string;
    name: string;
    level: number;
    age: number;
    desc: string;
}

const FoundUserCard = ({image, name, age, level, desc}: FoundUserCardProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.card_up}>
                <div className={styles.card_avatar}>
                    <img src={image} alt=""/>
                </div>
                <div className={styles.card_name}>
                    <h2>
                        {name}, {age} лет
                    </h2>
                    <div className={`orange_button_little`}>
                        Уровень {level}
                    </div>
                </div>
                <div className={styles.card_description}>
                    {desc}
                </div>
            </div>
            <div className={`action_button`}>
                Добавить в друзья
            </div>
        </div>
    );
};

export default FoundUserCard;