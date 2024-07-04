import styles from './VideoTrainingCard.module.scss';

import playIcon from '../../../../../Desktop/ribin/src/images/svg/play-button.svg';

interface IVideoTrainingCard {
    title: string;
    image: string;
    short_description: string;
}

const VideoTrainingCard = ({title, image, short_description}: IVideoTrainingCard) => {

    return (
        <div className={styles.card}>
            <div className={styles.card__video + " " + styles.video}>
                <img src={`images/${image}`} alt="" className={styles.video__poster}/>
                <div className={styles.video__playbutton}>
                    <img src={playIcon} alt="" />
                </div>
                <div className={styles.video__duration}>02:31</div>
            </div>
            <div className={styles.card__content}>
                <h3 className={styles.card__title}>{title}</h3>
                <p className={styles.card__desc}>{short_description}</p>
            </div>
        </div>
    );
};

export default VideoTrainingCard;