import React, {useRef, useState} from 'react';
import styles from './AchievementsPage.module.scss';
import Rubick from '../../images/svg/Rubick.svg';
import close from '../../images/svg/close.svg';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {Button, Modal} from "../../shared/UI";
import copy from '../../images/svg/copy.svg';
import gosomewhere from '../../images/svg/gosomwhere.svg';
import {Link} from "react-router-dom";
import {buyAward} from "../../store/awardSlice";


const achievements = [
    {
        title: 'Экскурсия по базе 20 детей (2 раза/мес)',
        image: '/images/excursion.png',
        price: 10000,
        closed: false
    },
    {
        title: 'Видеозвонок от игрока 5 мин (10 шт)',
        image: '/images/видеозвонок.png',
        price: 18000,
        closed: false
    },
    {
        title: 'День с игроком на базе (10 шт)',
        image: '/images/day.png',
        price: 20000,
        closed: false
    },
    {
        title: 'Открытый урок в школе с футболистом (10 шт)',
        image: '/images/lesson.png',
        price: 18000,
        closed: false
    },
    {
        title: 'Посещение открытой тренировки (50 шт)',
        image: 'images/training.png',
        price: 10000,
        closed: false
    },
    {
        title: 'Видеопоздравление от игрока с днём рождения (30 шт)',
        image: '/images/birthday.png',
        price: 18000,
        closed: false
    },
    {
        title: 'Участие в выведи футболиста',
        image: '/images/footbaler.png',
        price: 20000,
        closed: false
    },
    {
        title: 'Нанесение символического удара (3 шт)',
        image: '/images/strike.png',
        price: 20000,
        closed: false
    },
    {
        title: 'Тренировка на базе с тренером',
        image: '/images/coachtraining.png',
        price: 20000,
        closed: false
    },
    {
        title: 'Объявление стартового состава на игре (2 шт на детском матче)',
        image: '/images/sostav.png',
        price: 20000,
        closed: false
    },
    {
        title: 'Экскурсия по Ак Барс Арене (2 раза/мес)',
        image: '/images/akbars.png',
        price: 20000,
        closed: false
    },
    {
        title: 'Брелок',
        image: '/images/брелъъок.png',
        price: 700,
        closed: false
    },
    {
        title: 'Ручка',
        image: '/images/Ручка.png',
        price: 700,
        closed: false
    },
    {
        title: 'Значок',
        image: '/images/Значок.png',
        price: 700,
        closed: false
    },
    {
        title: 'Кепка',
        image: '/images/кепка.png',
        price: 4500,
        closed: false
    },
    {
        title: 'Футболка',
        image: '/images/футболка.png',
        price: 10000,
        closed: false
    },
    {
        title: 'Шапка',
        image: '/images/шапка.png',
        price: 4500,
        closed: false
    },
    {
        title: 'Кружка',
        image: '/images/кружка.png',
        price: 200,
        closed: false
    },
    {
        title: 'Шарф',
        image: '/images/шарф.png',
        price: 2000,
        closed: false
    },
    {
        title: 'Магнит',
        image: '/images/Магнит.png',
        price: 300,
        closed: false
    },
]

const AchievementsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const dispatch = useDispatch<AppDispatch>()
    const promo = useRef();
    const [isCopied, setIsCopied] = useState(false);

    const handleBuy = (item) => {
        if (user.rubick < item.price) {
            setIsModalOpen(true);
        } else {
            setCurrentItem(item);
            if (currentItem) {
                setIsTradeModalOpen(true);
            }
        }
    }

    const confirmBuy = async (item) => {
       const buy = await dispatch(buyAward());
       console.log(buy);
    }

    const copyToClipboard = () => {
        if (promo.current) {
            // @ts-ignore
            navigator.clipboard.writeText(promo.current.innerText)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 2000); // Длительность анимации в миллисекундах
                })
                .catch(err => {
                    console.error('Ошибка копирования: ', err);
                });
        } else {
            console.error('Элемент с промокодом не найден.');
        }
    };


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
                        <div className={styles.promo}>
                            <div className={styles.promo_logo}>
                                <img src="/images/rubin%20logo.png" alt=""/>
                            </div>
                            <div className={styles.promo_info}>
                                <h2>Билет на матч</h2>
                                <div className={styles.promo_info_button}>
                                    Бесплатно
                                </div>
                            </div>
                            <div className={styles.promo_code}>
                                <div className={`${styles.promo_code_copy} ${isCopied ? styles.promo_code_copy_Copied : ''}`}>
                                    {
                                        isCopied && (
                                            <div className={styles.promoMessage}>
                                                Промокод скопирован
                                            </div>
                                        )
                                    }
                                    <p ref={promo}>ШКОЛА</p>
                                    <div className={styles.promo_code_copy_round} onClick={copyToClipboard}>
                                        <img src={copy} alt=""/>
                                    </div>
                                </div>
                                <Link to='https://tickets.rubin-kazan.ru/event?id_event=631' target='_blank'>
                                    <div className={styles.promo_code_go}>
                                        <img src={gosomewhere} alt=""/>
                                    </div>
                                </Link>
                            </div>
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
            <Modal active={isModalOpen} setActive={setIsModalOpen} className={styles.modal} bodyClassName={styles.modalNotEnough}>
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
            <Modal active={isTradeModalOpen} setActive={setIsTradeModalOpen} className={styles.modal} bodyClassName={styles.modalTrade}>
                <div className={styles.modal_content}>
                    <div className={styles.modal_image}>
                        <img src={currentItem?.image} alt=""/>
                    </div>
                    <div className={styles.modal_info}>
                        <h1>Подтвердите обмен</h1>
                        <p>
                            Вы собираетесь потратить <span><img src={Rubick} alt=""/>{currentItem?.price}</span> рубинчиков. Подтвердите, что хотите получить выбранный предмет в обмен на ваши рубинчики.
                        </p>
                    </div>
                    <div className={styles.modal_buttons}>
                        <button onClick={() => confirmBuy(currentItem)}
                            className={`${styles.modal_button} ${styles.modal_buttonAccess}`}>
                            Подтвердить
                        </button>
                        <button onClick={() => setIsTradeModalOpen(false)}
                            className={`${styles.modal_button} ${styles.modal_buttonDecline}`}
                        >
                            Отменить
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AchievementsPage;