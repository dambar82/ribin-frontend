import React from 'react';
import styles from './FoundUserCard.module.scss';
import {sendFriendRequest} from "../../store/peopleSlice";
import {useAppDispatch} from "../../store/hooks";

interface FoundUserCardProps {
    image: string;
    name: string;
    level: number;
    age: number;
    desc: string;
    id: number;
}


const convertMillisecondsToYears = (milliseconds: number): number => {
    const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;
    return Math.floor(milliseconds / millisecondsInYear);
};

const FoundUserCard = ({image, name, age, id, level, desc}: FoundUserCardProps) => {

    const dispatch = useAppDispatch();

    const ageInYears = convertMillisecondsToYears(age);

    const handleFriendAdd = () => {
        dispatch(sendFriendRequest({receiverId: id}))
    }

    return (
        <div className={styles.card}>
            <div className={styles.card_up}>
                <div className={styles.card_avatar}>
                    <img src={image} alt=""/>
                </div>
                <div className={styles.card_name}>
                    <h2>
                        {name}, {ageInYears} лет
                    </h2>
                    <div className={`orange_button_little`}>
                        Уровень {level}
                    </div>
                </div>
                <div className={styles.card_description}>
                    {desc}
                </div>
            </div>
            <div className={`action_button`} onClick={handleFriendAdd}>
                Добавить в друзья
            </div>
        </div>
    );
};

export default FoundUserCard;
