import styles from './PersonCard.module.scss';
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";

interface IPersonalCard {
    name: string;
    imageUrl: string;
    id: number;
    type: string;
    details: any;
    body: any;
}

const PersonCard = ({name, id, type, details, body, imageUrl}: IPersonalCard) => {

    return (
        <div className={styles.card}>
            <div className={styles.card__image}>
                <img src={imageUrl} alt="" />
            </div>
            <div className={styles.card__content}>
                <div className={styles.card__name}>{name}</div>
                <div className={styles.card__info}>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: body
                            }}
                        />
                </div>
            </div>
        </div>
    )
}

export default PersonCard