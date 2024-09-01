import React, {useState} from 'react';
import styles from './AchievementsPage.module.scss';
import Rubick from '../../images/svg/Rubick.svg';
import close from '../../images/svg/close.svg';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Button, Modal} from "../../shared/UI";


const achievements = [
    {
        title: 'Кружка',
        image: null,
        price: 2000,
        closed: true
    },
    {
        title: 'Шарф',
        image: null,
        price: 2000,
        closed: true
    },
    {
        title: '2 билета на матч основы',
        image: null,
        price: 2000,
        closed: true
    },
    {
        title: 'Кепка',
        image: '/images/cap.png',
        price: 4500,
        closed: true
    },
    {
        title: 'Шапка',
        image: null,
        price: 4500,
        closed: true
    },
    {
        title: 'Футболка',
        image: null,
        price: 10000,
        closed: true
    },
    {
        title: 'Видеопоздравление от игрока с др',
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
        title: 'Нанесение симв удара (3 шт)',
        image: '/images/strike.png',
        price: 20000,
        closed: true
    },
    {
        title: 'Объявление стартового состава на игре',
        image: '/images/sostav.png',
        price: 20000,
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
                        {achievements.map(item => (
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