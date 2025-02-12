import React, {useEffect, useState} from 'react';
import styles from './BalanceHistory.module.scss';
import rubikStraight from '../../images/svg/rubikStraight.svg';
import axios from "axios";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

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

    const user = useSelector((state: RootState) => state.user.user);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const response = await axios.get('https://api-rubin.multfilm.tatar/api/rubicks', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log(response.data)
            setHistory(response.data.data)
        }

        fetchHistory();
    }, [])

    useEffect(() => {
        console.log(history)
    }, [history])

    // @ts-ignore
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
                    </div>
                    {
                        history && history.length > 0 && (
                        <div className={styles.main_flex}>
                            {
                                history.map(item => (
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
                </div>
            </section>
        </div>
    );
};

export default BalanceHistory;