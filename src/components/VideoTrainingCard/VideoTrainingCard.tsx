import styles from './VideoTrainingCard.module.scss';
import playIcon from '../../images/svg/play-button.svg';
import stopIcon from '../../images/svg/stopIcon.svg';
import {useState, useRef} from "react";

interface IVideoTrainingCard {
    title: string;
    image: string; // Предполагается, что это URL видео
    description: string;
}

const VideoTrainingCard = ({ title, image, description }: IVideoTrainingCard) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration); // Получаем продолжительность при загрузке метаданных
        }
    };

    // Функция для форматирования времени в формате "MM:SS"
    const formatDuration = ( seconds: number ) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.card}>
            <div
                className={`${styles.card__video} ${styles.video}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={togglePlayPause}
            >
                {image && (
                    <video
                        ref={videoRef}
                        src={image}
                        className={styles.video__poster}
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                )}
                {(isHovered || !isPlaying) && ( // Показываем иконку, если мышь наведена или видео остановлено
                    <div className={styles.video__playbutton}>
                        <img src={isPlaying ? stopIcon : playIcon} alt={isPlaying ? "Stop" : "Play"} />
                    </div>
                )}
                {
                    !isPlaying && <div className={styles.video__duration}>{formatDuration(duration)}</div>
                }
            </div>
            <div className={styles.card__content}>
                <h3 className={styles.card__title}>{title}</h3>
                <p className={styles.card__desc}>{description}</p>
            </div>
        </div>
    );
};

export default VideoTrainingCard;