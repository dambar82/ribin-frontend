import styles from './ClubCard.module.scss';
import participantsIcon from '../../images/svg/participants.svg';
import { Link } from 'react-router-dom'

interface IClubCard {
  id: number
    name: string;
    image: string;
    desc: string;
    participants: number;
}


const ClubCard = ({ id, name, image, desc, participants }: IClubCard) => {
    // {title, image, short_description, participants}: IClubCard
    return (
        <div className={styles.card}>
            <div className={styles.card__image}>
                { image && <img src={image} alt=''/>}
                {/* <img src={`images/club-image-${image}.png`} alt="" /> */}
            </div>
            <div className={styles.card__content}>
                <div className={styles.card__participants}>
                    <div className={styles.card__participantsIcon}>
                        <img src={participantsIcon} />
                    </div>
                    <div className={styles.card__participantsLabel}>
                        <span>{participants}</span> участников
                    </div>
                </div>
                <h3 className={styles.card__title}>{ name }</h3>
                <p className={styles.card__desc}>{ desc }</p>
            </div>
            <Link
              to={`/clubs/${id}`}
              className={`${styles.card__button} button button--black`}
              type="button"
              onClick={() => setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 100)}
            >
                <span>Вступить в клуб</span>
            </Link>
        </div>
    );
};

export default ClubCard;