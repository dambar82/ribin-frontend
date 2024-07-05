import React, {useState} from 'react';
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

    const { people, status } = useSelector((state: RootState) => state.people)
    const [searchTerm, setSearchTerm] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [filteredPeople, setFilteredPeople] = useState<User[]>([]);

    React.useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchoolId(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredPeople = people.filter((user) => {
            return user.name.toLowerCase().includes(searchTerm.toLowerCase())
            // user.school.toString() === schoolId
        });
        console.log(filteredPeople)
        setFilteredPeople(filteredPeople);
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
                    <div className='section__counter'>2303</div>
                </div>
                <div className={`section__body`}>
                    <Grid totalItems={filteredPeople.length}>
                        {filteredPeople && filteredPeople.map((user: User) => (
                            <FoundUserCard image={user.image} name={user.name} age={user.age} level={14} desc={'Обожаю играть в футбол и всегда рад новым друзьям. Давай играть вместе и достигать новых вершин вместе!'}/>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default UsersFilter;