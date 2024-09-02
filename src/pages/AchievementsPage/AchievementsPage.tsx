import React, {useState} from 'react';
import styles from './AchievementsPage.module.scss';
import Rubick from '../../images/svg/Rubick.svg';
import close from '../../images/svg/close.svg';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Button, Modal} from "../../shared/UI";


const achievements = [
    {
        title: 'Экскурсия по базе 20 детей (2 раза/мес)',
        image: '/images/excursion.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Видеозвонок от игрока 5 мин (10 шт)',
        image: '/images/видеозвонок.png',
        price: 2000,
        closed: true
    },
    {
        title: 'День с игроком на базе (10 шт)',
        image: '/images/day.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Открытый урок в школе с футболистом',
        image: '/images/lesson.png',
        price: 4500,
        closed: true
    },
    {
        title: 'Посещение открытой тренировки (50 шт)',
        image: 'images/training.png',
        price: 4500,
        closed: true
    },
    {
        title: 'Видеопоздравление от игрока с днём рождения (30 шт)',
        image: '/images/birthday.png',
        price: 18000,
        closed: true
    },
    {
        title: 'Участие в выведи футболиста',
        image: '/images/footbaler.png',
        price: 20000,
        closed: true
    },
    {
        title: 'Нанесение символического удара (3 шт)',
        image: '/images/strike.png',
        price: 20000,
        closed: true
    },
    {
        title: 'Тренировка на базе с тренером',
        image: '/images/coachtraining.png',
        price: 20000,
        closed: true
    },
    {
        title: 'Объявление стартового состава на игре (2 шт на детском матче)',
        image: '/images/sostav.png',
        price: 20000,
        closed: true
    },
    {
        title: 'Экскурсия по Ак Барс Арене (2 раза/мес)',
        image: '/images/akbars.png',
        price: 20000,
        closed: true
    },
    {
        title: 'Брелок',
        image: '/images/брелъъок.png',
        price: 700,
        closed: true
    },
    {
        title: 'Ручка',
        image: '/images/Ручка.png',
        price: 700,
        closed: true
    },
    {
        title: 'Значок',
        image: '/images/Значок.png',
        price: 700,
        closed: true
    },
    {
        title: 'Кепка',
        image: '/images/кепка.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Футболка',
        image: '/images/футболка.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Шапка',
        image: '/images/шапка.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Кружка',
        image: '/images/кружка.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Шарф',
        image: '/images/шарф.png',
        price: 2000,
        closed: true
    },
    {
        title: 'Магнит',
        image: '/images/Магнит.png',
        price: 700,
        closed: true
    },
]

const AchievementsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBuy = (item) => {
        if (user.rubick < item.price) {
            setIsModalOpen(true);
        } else {
            // Логика покупки
        }
    }

    const sortedAchievements = achievements.sort((a, b) => a.price - b.price);

    return (
        <div className='page'>
            <section className={`${styles.achievements} section`}>
                <div className='section__header'>
                    <h2 className='section__title'>Вознаграждения</h2>
                </div>
                <div className={`section__body ${styles.achievements__body}`}>
                    <div className={styles.achievements__body_high}>
                        <p>
                            За участие на сайте вы получаете Рубики, которые можете поменять на промокод дающий скидку (100%) в магазине <a
                            href="https://store.rubin-kazan.ru">https://store.rubin-kazan.ru</a>
                        </p>
                        <div className={styles.rubicks}>
                            <img src={Rubick} alt=""/>
                            <span>Рубиков</span>
                            <span>{user.rubick}</span>
                        </div>
                    </div>
                    <div className={styles.awards_grid}>
                        {sortedAchievements.map(item => (
                            <div className={styles.award_card} onClick={() => handleBuy(item)}>
                                <div className={styles.award_card_image}>
                                    <img className={styles.award_card_image_IMG} src={item.image} alt=""/>
                                    {item.closed && (
                                        <div className={styles.close_icon}>
                                            <img src={close} alt=""/>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.award_card_info}>
                                    <p>
                                        {item.title}
                                    </p>
                                    <span>
                                        <img src={Rubick} alt=""/>
                                        {item.price}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Modal active={isModalOpen} setActive={setIsModalOpen} className={styles.modal}>
                <div className={styles.modal_content}>
                    <h1>
                        Недостаточно Рубиков для покупки
                    </h1>
                    <p>
                        К сожалению, у вас недостаточно Рубиков для совершения этой покупки. Заработайте больше, участвуя в активности на сайте, и вернитесь позже, чтобы обменять их на желаемую скидку!
                    </p>
                    <Button onClick={() => setIsModalOpen(false)}>Понятно</Button>
                </div>
                </Modal>
        </div>
    );
};

export default AchievementsPage;