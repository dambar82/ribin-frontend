import styles from './ClubCard.module.scss';
import participantsIcon from '../../images/svg/participants.svg';
import clubImage from '../../images/clubimage.jpg'

// interface IClubCard {
//     title: string;
//     image: string;
//     participants: number;
//     short_description: string;
// }

// {title, image, short_description, participants}: IClubCard

const ClubCard = () => {
    return (
        <div className={styles.card}>
            <div className={styles.card__image}>
                <img src={clubImage} alt="" />
                {/* {image && <img src={image}/>} */}
            </div>
            <div className={styles.card__content}>
                <div className={styles.card__participants}>
                    <div className={styles.card__participantsIcon}>
                        <img src={participantsIcon} />
                    </div>
                    <div className={styles.card__participantsLabel}>
                        <span>25</span> участников
                    </div>
                </div>
                <h3 className={styles.card__title}>Фитнес-клуб "Футбол и здоровье"</h3>
                <p className={styles.card__desc}>Клуб для тех, кто хочет улучшить свою физическую форму через футбольные тренировки. Включает кардиотренировки, специальные упражнения и футбольные игры. Также проводятся занятия по правильному питанию и общему укреплению здоровья.</p>
            </div>
            <button className={`${styles.card__button} button button--black`} type="button">
                <span>Вступить в клуб</span>
            </button>
        </div>
    );
};

export default ClubCard;
