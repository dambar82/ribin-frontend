import React from 'react';
import ReactPlayer from 'react-player';

const TextWithVideo = ({ htmlContent }) => {
    // Регулярное выражение для поиска URL-ов в HTML
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    // Функция для замены URL-ов на видео-плееры
    const replaceUrlsWithPlayers = (html) => {
        const parts = html.split(urlPattern);

        return parts.map((part, index) => {
            console.log(part);
            // Если часть совпадает с URL, проверяем, поддерживается ли она ReactPlayer
            if (ReactPlayer.canPlay(part)) {
                return (
                    <div key={index}>
                        <ReactPlayer
                            url={part}
                            controls={true}
                            width="100%"
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
            }
            // Иначе возвращаем часть текста как HTML
            return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        });
    };

    return (
        <div>
            {replaceUrlsWithPlayers(htmlContent)}
        </div>
    );
};

export default TextWithVideo;