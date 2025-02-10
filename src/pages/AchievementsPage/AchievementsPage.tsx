import React, {useEffect, useRef, useState} from 'react';
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
import axios from "axios";
import blackArrowDown from '../../images/svg/blackArrowDown.svg';
import blackArrowUp from '../../images/svg/blackArrowUp.svg';
import rubiki from '../../images/rubiki.png';

const token = JSON.parse(localStorage.getItem('token') || '0')

const AchievementsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [isBoughtModal, setIsBoughtModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [awards, setAwards] = useState(null);
    const [myAwards, setMyAwards] = useState([]);
    const [sortedAwards, setSortedAwards] = useState([]);
    const [promocode, setPromocode] = useState(null);
    const [copiedPromo, setCopiedPromo] = useState(null);
    const dispatch = useDispatch<AppDispatch>()
    const promo = useRef();
    const boughtPromo = useRef();
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const fetchAwards = async () => {
            const response = await axios.get('https://api-rubin.multfilm.tatar/api/gifts', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setAwards(response.data);
        }
        const fetchMyAwards = async () => {
            const response = await axios.get('https://api-rubin.multfilm.tatar/api/gifts/promo_code', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setMyAwards(response.data.data)
        }
        fetchAwards();
        fetchMyAwards();
    }, [])

    const handleBuy = (item) => {
        if (item.open === 0) return;
        if (awards[0] < Number(item.value)) {
            setIsModalOpen(true);
        } else {
            setCurrentItem(item);
            if (currentItem) {
                setIsTradeModalOpen(true);
            }
        }
    }

    const confirmBuy = async (item) => {
        const data = new FormData();
        data.append('giftIds[]', item.id);
        // @ts-ignore
        const buy = await dispatch(buyAward(data));
        if (buy) {
            setPromocode(buy.payload.promo_codes[0].promo_code);
            setIsTradeModalOpen(false);
            setIsBoughtModal(true);
        } else {
            setIsTradeModalOpen(false);
            return
        }
    }

    const copyToClipboard = (promoCode) => {
        navigator.clipboard.writeText(promoCode).then(() => {
            setCopiedPromo(promoCode); // Устанавливаем состояние для отображения сообщения
            setTimeout(() => {
                setCopiedPromo(null); // Очищаем сообщение после 2 секунд
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    useEffect(() => {
        if (awards) {
            setSortedAwards(awards[1].sort((a, b) => a.value - b.value));
        }
    }, awards)


    const [selectedOption, setSelectedOption] = useState('Все вознаграждения');
    const selectRef = useRef(null);
    const [selectIsOpen, setSelectIsOpen] = useState(false);

    const toggleSelect = () => {
        setSelectIsOpen(!selectIsOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setSelectIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setSelectIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!awards) return <p>Загрузка...</p>


    return (
        <div className='page'>
            <section className={`${styles.achievements} section`}>
                <div className='section__header'>
                    <h2 className='section__title'>Вознаграждения</h2>
                    <div className={styles.awards_select} ref={selectRef}>
                        <div className={styles.awards_selected} onClick={toggleSelect}>
                            <span>{selectedOption}</span>
                            {selectIsOpen ? <img src={blackArrowUp} alt=''/> : <img src={blackArrowDown} alt=''/>}
                        </div>
                        {selectIsOpen && (
                            <div className={styles.awards_selectItems}>
                                {['Все вознаграждения', 'Полученные вознаграждения'].map((option, index) => (
                                    <div key={index} onClick={() => handleOptionClick(option)}>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {
                    selectedOption === 'Все вознаграждения' ? (
                        <div className={`section__body ${styles.achievements__body}`}>
                            <div className={styles.achievements__body_high}>
                                <p>
                                    За участие на сайте вы получаете Рубики, которые можете поменять на промокод дающий скидку (100%) в магазине <a
                                    href="https://store.rubin-kazan.ru">https://store.rubin-kazan.ru</a>
                                </p>
                                <div className={styles.rubicks}>
                                    <img src={Rubick} alt=""/>
                                    <span>Рубиков</span>
                                    <span>{awards[0]}</span>
                                </div>
                                {
                                    user?.filled === 0 && (
                                        <div className={styles.message}>
                                            <div className={styles.promo_logo}>
                                                <img src={rubiki} alt=""/>
                                            </div>
                                            <div className={styles.promo_info}>
                                                <h2>
                                                    100 рубиков за заполнение профиля и настроек!
                                                </h2>
                                                <p>
                                                    Просто закончи заполнение профиля: добавь аватарку, обложку и расскажи о себе, а в настройках укажи возраст, школу и город. Потрать пару минут — и бонус твой!
                                                </p>
                                            </div>
                                            <Link to='/settings'>
                                                <div className={styles.promo_code_go}>
                                                    <img src={gosomewhere} alt=""/>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={styles.awards_grid}>
                                {sortedAwards.map(item => (
                                    <div className={styles.award_card} onClick={() => handleBuy(item)}>
                                        <div className={styles.award_card_image}>
                                            <img className={styles.award_card_image_IMG} src={item.image} alt=""/>
                                            {item.open === 0 && (
                                                <div className={styles.close_icon}>
                                                    <img src={close} alt=""/>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.award_card_info}>
                                            <p>
                                                {item.key}
                                            </p>
                                            <span>
                                        <img src={Rubick} alt=""/>
                                                {item.value}
                                    </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={`${styles.achievements__body} ${styles.achievements__body_myAwards}`}>
                            {myAwards.map(awards => (
                                <div className={styles.myAwards_block}>
                                    <div className={styles.myAwards_block_image}>
                                        <img src={awards.image} alt=""/>
                                    </div>
                                    <div className={styles.promo_info}>
                                        <h2>{awards.gift}</h2>
                                        <div className={styles.promo_info_button} style={{width: '138px'}}>
                                            Рубиков <span>{awards.price}</span>
                                        </div>
                                    </div>
                                    <div className={styles.promo_code}>
                                        <div className={`${styles.promo_code_copy} ${copiedPromo === awards.promo_code ? styles.promo_code_copy_Copied : ''}`}>
                                            {
                                                copiedPromo === awards.promo_code && (
                                                    <div className={styles.promoMessage}>
                                                        Промокод скопирован
                                                    </div>
                                                )
                                            }
                                            <p>{awards.promo_code}</p>
                                            <div className={styles.promo_code_copy_round} onClick={() => copyToClipboard(awards.promo_code)}>
                                                <img src={copy} alt=""/>
                                            </div>
                                        </div>
                                        <Link to='https://store.rubin-kazan.ru' target='_blank'>
                                            <div className={styles.promo_code_go}>
                                                <img src={gosomewhere} alt=""/>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
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
                            Вы собираетесь потратить <span><img src={Rubick} alt=""/>{currentItem?.value}</span> рубинчиков. Подтвердите, что хотите получить выбранный предмет в обмен на ваши рубинчики.
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
            <Modal active={isBoughtModal} setActive={setIsBoughtModal} className={styles.modal} bodyClassName={styles.modalTrade}>
                <div className={styles.modal_content}>
                    <div className={styles.modal_image}>
                        <img src={currentItem?.image} alt=""/>
                    </div>
                    <div className={styles.modal_info}>
                        <h1>Ваш промокод для активации</h1>
                        {currentItem?.is_material === 1 ? (
                            <p>
                                Скопируйте промокод и воспользуйтесь им на сайте: <a href='https://store.rubin-kazan.ru'>https://store.rubin-kazan.ru</a> для получения бонуса.
                            </p>
                        ) : (
                            <p>
                                Для получения вознаграждения свяжитесь по почте rubinkids@yandex.ru
                            </p>
                        )}
                    </div>
                    <div className={`${styles.promo_code_copy} ${isCopied ? styles.promo_code_copy_Copied : ''}`} style={{width: '100%'}}>
                        {
                            copiedPromo === promocode && (
                                <div className={styles.promoMessage}>
                                    Промокод скопирован
                                </div>
                            )
                        }
                        <p style={{marginBottom: '0'}} ref={boughtPromo}>{promocode}</p>
                        {//@ts-ignore
                        <div className={`${styles.promo_code_copy_round}`} onClick={() => copyToClipboard(boughtPromo.current.innerText)}>

                            <img src={copy} alt=""/>
                        </div>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AchievementsPage;