import React from 'react';
import ReactPlayer from 'react-player';
import VKPlayer from "../VKPlayer/VKPlayer";

const TextWithVideo = ({ htmlContent }) => {
    // Регулярное выражение для поиска URL-ов в HTML
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    // Функция для замены URL-ов на видео-плееры
    const replaceUrlsWithPlayers = (html) => {
        const parts = html.split(urlPattern);

        return parts.map((part, index) => {
            // Если часть совпадает с URL, проверяем, поддерживается ли она ReactPlayer
            if (ReactPlayer.canPlay(part)) {
                return (
                    <div key={index} className='post_video_wrapper'>
                        <ReactPlayer
                            url={part}
                            controls={true}
                            width="100%"
                            height="480px"
                            config={{
                                vimeo: {
                                    playerOptions: {
                                        autoplay: false,
                                        title: false,
                                        byline: false,
                                        portrait: false,
                                    }
                                }
                            }}
                        />
                    </div>
                );
            } else if (part.includes('vk.com/video')) {
                return (
                    <div key={index} className='post_video_wrapper'>
                        <VKPlayer url={part} />
                    </div>
                );
            }
            // Если это URL, который не является видео, оборачиваем его в тег <a>
            if (urlPattern.test(part)) {
                return (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{color: '#91172C'}}>
                        {part}
                    </a>
                );
            }
            // Иначе возвращаем часть текста как обычный текст
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div>
            {replaceUrlsWithPlayers(htmlContent)}
        </div>
    );
};

export default TextWithVideo;