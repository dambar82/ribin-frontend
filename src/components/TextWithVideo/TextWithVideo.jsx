import React from 'react';
import ReactPlayer from 'react-player';
//import VKPlayer from "../VKPlayer/VKPlayer";


const VKPlayer = ({ url }) => {
    const videoIdMatch = url.match(/video(-?\d+)_(\d+)/);

    if (!videoIdMatch) {
        return <p>Invalid VK video URL</p>;
    }

    const oid = videoIdMatch[1];
    const id = videoIdMatch[2];
    const embedUrl = `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;

    return (
        <iframe
            src={embedUrl}
            width="100%"
            height="480"
            frameBorder="0"
            allow="encrypted-media; fullscreen; picture-in-picture; screen-wake-lock"
            allowFullScreen
        />
    );
};

const OKPlayer = ({ url }) => {
    const videoIdMatch = url.match(/video\/(\d+)/);

    if (!videoIdMatch) {
        return <p>Invalid OK video URL</p>;
    }

    const id = videoIdMatch[1];
    const embedUrl = `https://ok.ru/videoembed/${id}`;

    return (
        <iframe
            src={embedUrl}
            width="100%"
            height="480"
            frameBorder="0"
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
        />
    );
};

const RuTubePlayer = ({ url }) => {
    const videoIdMatch = url.match(/\/video\/([a-zA-Z0-9_-]+)/);

    if (!videoIdMatch) {
        return <p>Invalid RuTube video URL</p>;
    }

    const id = videoIdMatch[1];
    const embedUrl = `https://rutube.ru/play/embed/${id}`;

    return (
        <iframe
            src={embedUrl}
            width="100%"
            height="480"
            frameBorder="0"
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
        />
    );
};

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
            } else if (part.includes('ok.ru/video')) {
                return (
                    <div key={index} className='post_video_wrapper'>
                        <OKPlayer url={part} />
                    </div>
                );
            } else if (part.includes('rutube.ru/video')) {
                return (
                    <div key={index} className='post_video_wrapper'>
                        <RuTubePlayer url={part} />
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