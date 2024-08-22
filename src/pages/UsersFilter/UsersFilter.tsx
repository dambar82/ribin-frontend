import React, {useEffect, useState} from 'react';
import styles from './UsersFilter.module.scss';
import loupe from '../../images/svg/loupe.svg';
import select_arrow_down from '../../images/svg/select_arrow_down.svg';
import buttonArrow from '../../images/svg/button_arrow.svg';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useAppDispatch} from "../../store/hooks";
import {fetchPeople} from "../../store/peopleSlice";
import Grid from "../../components/Grid/Grid";
import {User} from "../../store/userSlice";
import FoundUserCard from "../../components/FoundUserCard/FoundUserCard";

const UsersFilter = () => {

    const dispatch = useAppDispatch();

    const user = useSelector((state: RootState) => state.user);
    const { people, status } = useSelector((state: RootState) => state.people)
    const [searchTerm, setSearchTerm] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [filteredPeople, setFilteredPeople] = useState<User[]>([]);

    React.useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    useEffect(() => {
        const filterPeople = () => {
            return people
                .filter((p) => p.id !== user.user.id) // Исключаем текущего пользователя
                .filter((p) => {
                    const matchesSchool = schoolId ? p.school === parseInt(schoolId) : true; // Фильтруем по школе, если указана
                    const matchesName = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true; // Фильтруем по имени, если указано
                    return matchesSchool && matchesName;
                })
                .filter((p) => p.school !== null || !schoolId); // Исключаем пользователей с null в поле school, если фильтр по школе применен
        };

        setFilteredPeople(filterPeople());
    }, [searchTerm, schoolId, people, user.user.id]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchoolId(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let filteredPeople;

        if (searchTerm.trim() === '') {
            // Если строка поиска пуста, сбрасываем фильтрацию и показываем всех пользователей (кроме текущего)
            filteredPeople = people.filter((p) => p.id !== user.user.id);
        } else {
            // Фильтруем пользователей по имени и исключаем текущего пользователя
            filteredPeople = people
                .filter((p) => p.id !== user.user.id)
                .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredPeople(filteredPeople);
    }

    if (!filteredPeople) {
        return <p>Loading...</p>;
    }

    // @ts-ignore
    return (
        <div className={`page`}>
            <div className={`section shadowBlock ${styles.filterBlock}`}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>
                        Поиск пользователей
                    </h2>
                    <div className={styles.form_inputField}>
                        <div className={styles.input}>
                            <label htmlFor="searchFilter">Поиск</label>
                            <div className={styles.searchBar}>
                                <img src={loupe} alt=""/>
                                <input type="text" id='searchFilter' value={searchTerm} onChange={handleSearchChange} placeholder='Введите имя и фамилию, чтобы найти пользователя'/>
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
                                <input type="number" id='schoolFilter' value={schoolId} onChange={handleSchoolChange} placeholder='Номер школы'/>
                            </div>
                        </div>
                    </div>
                    {/*<button className={`action_button ${styles.actionButton}`} type='submit'>*/}
                    {/*    Показать результат*/}
                    {/*    <img src={buttonArrow} alt=""/>*/}
                    {/*</button>*/}
                </form>
                <div className={styles.image}>
                    <img src="/images/drakosha.jpg" alt=""/>
                </div>
            </div>
            <div className={`section`}>
                <div className='section__header'>
                    <div className='section__title'>Результатов</div>
                    <div className='section__counter'>{filteredPeople.length}</div>
                </div>
                <div className={`section__body`}>
                    <Grid totalItems={filteredPeople.length}>
                        {filteredPeople && filteredPeople.map((user: User) => (
                            <FoundUserCard key={user.id} image={user.avatar} name={user.name} age={user.birthdate} level={user.level} id={user.id} desc={user.description}/>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default UsersFilter;
