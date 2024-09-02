import React from 'react';

const VKPlayer = ({ url }) => {
    // Извлечение ID видео и oid из URL
    const videoIdMatch = url.match(/video(-?\d+)_(\d+)/);

    if (!videoIdMatch) {
        return <p>Invalid VK video URL</p>;
    }

    const oid = videoIdMatch[1];
    const id = videoIdMatch[2];

    // Формируем embed URL для iframe
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

export default VKPlayer;