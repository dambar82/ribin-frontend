import React, {useState} from 'react';
import styles from './UsersFilter.module.scss';
import loupe from '../../images/svg/loupe.svg';
import select_arrow_down from '../../images/svg/select_arrow_down.svg';
import buttonArrow from '../../images/svg/button_arrow.svg';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useAppDispatch} from "../../store/hooks";
import {fetchPeople} from "../../store/peopleSlice";

const UsersFilter = () => {

    const dispatch = useAppDispatch();

    const { people, status } = useSelector((state: RootState) => state.people)
    const [searchTerm, setSearchTerm] = useState('');
    const [schoolId, setSchoolId] = useState('');

    React.useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchoolId(e.target.value);
    };

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        // Фильтрация пользователей по имени и номеру школы
        const filteredPeople = people.filter((user) => {
            return user.name.toLowerCase().includes(searchTerm.toLowerCase())
                // user.school.toString() === schoolId
        });
        console.log(filteredPeople);
        // Здесь вы можете обновить состояние с отфильтрованными пользователями
    };

    return (
        <div className={`page`}>
            <div className={`section shadowBlock ${styles.filterBlock}`}>
                <form className={styles.form}>
                    <h2>
                        Поиск пользователей
                    </h2>
                    <div className={styles.form_inputField}>
                        <div className={styles.input}>
                            <label htmlFor="searchFilter">Поиск</label>
                            <div className={styles.searchBar}>
                                <img src={loupe} alt=""/>
                                <input type="text" id='searchFilter' placeholder='Введите имя и фамилию, чтобы найти пользователя'/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.form_inputField}>
                        <div className={styles.input}>
                            <label htmlFor="sortFilter">Сортировать</label>
                            <div className={styles.searchBar}>
                                <select id='sortFilter'>
                                    <img src={select_arrow_down} alt=""/>
                                    <option value="">По активности</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.input}>
                            <label htmlFor="schoolFilter">Школа</label>
                            <div className={styles.searchBar}>
                                <img src={loupe} alt=""/>
                                <input type="number" id='schoolFilter' placeholder='Номер школы'/>
                            </div>
                        </div>
                    </div>
                    <button className={`action_button ${styles.actionButton}`}>
                        Показать результат
                        <img src={buttonArrow} alt=""/>
                    </button>
                </form>
                <div className={styles.image}>
                    <img src="/images/drakosha.jpg" alt=""/>
                </div>
            </div>
            <div className={`section`}>
                <div className='section__header'>
                    <div className='section__title'>Результатов</div>
                    <div className='section__counter'>2303</div>
                </div>
            </div>
        </div>
    );
};

export default UsersFilter;