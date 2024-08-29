import styles from './VideoTrainingCard.module.scss';
import {useState, useRef} from "react";


const playIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3.88638C5 2.25963 6.83874 1.31339 8.16248 2.25891L16.7215 8.37253C17.8382 9.17017 17.8382 10.8298 16.7215 11.6275L8.16248 17.7411C6.83874 18.6866 5 17.7404 5 16.1136V3.88638Z" fill="#91172C"/></svg>
const stopIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.83301 16.25V3.75" stroke="#91172C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.167 16.25V3.75" stroke="#91172C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>


interface IVideoTrainingCard {
    title?: string;
    image: string; // Предполагается, что это URL видео
    thumbnail?: string
    description?: string;
    onClick?: () => void
}

const VideoTrainingCard = ({ title, image, thumbnail, description, onClick }: IVideoTrainingCard) => {
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
                onClick={onClick || togglePlayPause}
            >
                {image && (
                    <video
                        ref={videoRef}
                        src={image}
                        poster={thumbnail}
                        className={styles.video__poster}
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                )}
                {(isHovered || !isPlaying) && ( // Показываем иконку, если мышь наведена или видео остановлено
                    <div className={styles.video__playbutton}>
                        {isPlaying ? stopIcon : playIcon}
                    </div>
                )}
                {
                    !isPlaying && <div className={styles.video__duration}>{formatDuration(duration)}</div>
                }
            </div>
            {!!title &&
              <div className={styles.card__content}>
                <h3 className={styles.card__title} dangerouslySetInnerHTML={{ __html: title || '' }}  ></h3>
                {!!description && <p className={styles.card__desc} dangerouslySetInnerHTML={{ __html: description || '' }} ></p>}
              </div>
            }
        </div>
    );
};

export default VideoTrainingCard;