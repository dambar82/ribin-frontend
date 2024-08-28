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

<<<<<<< HEAD
    const user = useSelector((state: RootState) => state.user);
=======
    const user = useSelector((state: RootState) => state.user || null);
>>>>>>> origin/anauthorized-access
    const { people, status } = useSelector((state: RootState) => state.people)
    const [searchTerm, setSearchTerm] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [filteredPeople, setFilteredPeople] = useState<User[]>([]);

    React.useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    useEffect(() => {
        setFilteredPeople(people.filter((p) => p.id !== user?.user?.id));
    }, [people, user?.user?.id]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') {
            setFilteredPeople(people.filter((p) => p.id !== user?.user?.id));
        }
    };


    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchoolName(e.target.value);
        if (e.target.value === '') {
            setFilteredPeople(people.filter((p) => p.id !== user?.user?.id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filtered = people
            .filter((p) => p.id !== user?.user?.id) // Исключаем текущего пользователя
            .filter((p) => {
                const matchesSchool = schoolName ? p.school?.toLowerCase() === schoolName.toLowerCase() : true;
                const matchesName = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                return matchesSchool && matchesName;
            })
            .filter((p) => p.school !== null || !schoolName);

        setFilteredPeople(filtered);
    };

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
                                <input type="text" id='schoolFilter' value={schoolName} onChange={handleSchoolChange} placeholder='Введите название или номер школы'/>
                            </div>
                        </div>
                    </div>
                    <button className={`action_button ${styles.actionButton}`} type='submit'>
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
