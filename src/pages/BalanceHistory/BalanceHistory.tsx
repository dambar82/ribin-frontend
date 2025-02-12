import React, {useEffect, useRef, useState} from 'react';
import styles from './BalanceHistory.module.scss';
import rubikStraight from '../../images/svg/rubikStraight.svg';
import axios from "axios";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import blackArrowUp from "../../images/svg/blackArrowUp.svg";
import blackArrowDown from "../../images/svg/blackArrowDown.svg";

const token = JSON.parse(localStorage.getItem('token') || '0')

function transformDate(dateStr) {
    // Разбиваем строку на день, месяц и год
    let [day, month, year] = dateStr.split('-').map(Number);

    // Вычитаем 5 месяцев
    month -= 5;

    // Если месяц ушел за январь, корректируем год и месяц
    if (month <= 0) {
        month += 12;
        year -= 1;
    }

    // Приводим день и месяц к двузначному формату
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `${formattedDay}.${formattedMonth}.${year}`;
}

const BalanceHistory = () => {

    const [selectedOption, setSelectedOption] = useState('Все');
    const selectRef = useRef(null);
    const [selectIsOpen, setSelectIsOpen] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);
    const [history, setHistory] = useState([]);
    const [displayedHistory, setDisplayedHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const containerRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);

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

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(
                    "https://api-rubin.multfilm.tatar/api/rubicks",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setHistory(response.data.data);
                const initialFiltered = response.data.data.filter((item) => {
                    if (selectedOption === "Все") return true;
                    if (selectedOption === "Зачисления") return item.up_rubicks !== null;
                    if (selectedOption === "Списания") return item.up_rubicks === null;
                    return true;
                });

                setDisplayedHistory(initialFiltered.slice(0, 20)); // Показываем первые 20 записей
                setHasMore(initialFiltered.length > 20); // Проверяем, есть ли еще данные
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = history.filter((item) => {
        if (selectedOption === "Все") return true;
        if (selectedOption === "Зачисления") return item.up_rubicks !== null;
        if (selectedOption === "Списания") return item.up_rubicks === null;
        return true;
    });


    // Загружает новые элементы при скролле вниз
    const loadMoreItems = () => {
        if (loading || !hasMore) return; // Если уже загружаем, ничего не делаем
        setLoading(true);

        setTimeout(() => {
            const newPage = page + 1;
            const newItems = filteredHistory.slice(0, newPage * 20); // По 10 элементов за раз
            setDisplayedHistory(newItems);
            setPage(newPage);
            setLoading(false);

            if (newItems.length >= filteredHistory.length) {
                setHasMore(false); // Если все данные загружены, больше не загружаем
            }

        }, 1000);
    };

    // Отслеживаем скролл
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMoreItems();
                }
            },
            { threshold: 1.0 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [loading, hasMore]);

    useEffect(() => {
        setDisplayedHistory(filteredHistory.slice(0, 20));
        setPage(1);
        setHasMore(filteredHistory.length > 20); // Пересчитываем hasMore
    }, [selectedOption]);

    return (
        <div className='page'>
            <section className={`${styles.balanceHistory} section`}>
                <div className='section__header'>
                    <h2 className='section__title'>История баланса</h2>
                    <div className={styles.rubicks}>
                        <img src={rubikStraight} alt=""/>
                        Рубиков <span>{user.rubick}</span>
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.main_header}>
                        <h3>Условие</h3>
                        <div className={styles.awards_select} ref={selectRef}>
                            <div className={styles.awards_selected} onClick={toggleSelect}>
                                <span>{selectedOption}</span>
                                {selectIsOpen ? <img src={blackArrowUp} alt=''/> : <img src={blackArrowDown} alt=''/>}
                            </div>
                            {selectIsOpen && (
                                <div className={styles.awards_selectItems}>
                                    {['Все', 'Зачисления', 'Списания'].map((option, index) => (
                                        <div key={index} onClick={() => handleOptionClick(option)}>
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {
                        displayedHistory.length > 0 && (
                        <div className={styles.main_flex}>
                            {
                                displayedHistory.map(item => (
                                    <div className={styles.item}>
                                        <div className={styles.item_part}>
                                            <span className={styles.date}>{transformDate(item.date)}</span>
                                            <h1>
                                                {item.operation_type}
                                            </h1>
                                        </div>
                                        <div className={styles.item_part}>
                                            <span className={styles.caption}>
                                                {
                                                    item.up_rubicks ? 'Поступление' : 'Списание'
                                                }
                                            </span>
                                            {
                                                item.up_rubicks ? (
                                                    <h2 className={styles.up_rubicks}>
                                                        +{item.up_rubicks}
                                                        <img src={rubikStraight}/>
                                                    </h2>
                                                ) : (
                                                    <h2 className={styles.down_rubicks}>
                                                        -{item.down_rubicks}
                                                        <img src={rubikStraight}/>
                                                    </h2>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                    <div ref={containerRef} style={{ height: '20px' }}></div>

                    {loading && <p>Загружаем ещё...</p>}
                </div>
            </section>
        </div>
    );
};

export default BalanceHistory;