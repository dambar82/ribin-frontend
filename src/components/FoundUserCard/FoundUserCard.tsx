import React from 'react';
import styles from './FoundUserCard.module.scss';
import {sendFriendRequest} from "../../store/peopleSlice";
import {useAppDispatch} from "../../store/hooks";
import {Link} from "react-router-dom";

interface FoundUserCardProps {
    image: string;
    name: string;
    surname: string;
    level: number;
    id: number;
}


const convertMillisecondsToYears = (milliseconds: number): number => {
    const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;
    return Math.floor(milliseconds / millisecondsInYear);
};

const FoundUserCard = ({image, name, surname, id, level }: FoundUserCardProps) => {

    const dispatch = useAppDispatch();

   // const ageInYears = convertMillisecondsToYears(age);

    return (
        <>
            <Link to={`/user/${id}`}>
                <div className={styles.card}>
                    <div className={styles.card_up}>
                        <div className={styles.card_avatar}>
                            <img src={image} alt=""/>
                        </div>
                        <div className={styles.card_name}>
                            <h2>
                                {name} {surname}
                            </h2>
                        </div>
                        <div className={styles.level}>
                            Уровень <span>{level}</span>
                        </div>
                    </div>
                    {/*<div className={`action_button`} onClick={handleFriendAdd}>*/}
                    {/*    Добавить в друзья*/}
                    {/*</div>*/}
                </div>
            </Link>
        </>
    );
};

export default FoundUserCard;
