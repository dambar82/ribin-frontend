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
import { Input } from '../../shared/UI'
import axios from 'axios'
import { classNames, getMostActiveUsers } from '../../shared/utils'

const enum ESortTypes {
  activity='activity',
  rating='rating',
  popularity='popularity'
}

const SORT_TYPES = [
  { key: ESortTypes.activity, value: 'По активности' },
  { key: ESortTypes.rating, value: 'По рейтингу' },
  { key: ESortTypes.popularity, value: 'По популярности' },
]


const UsersFilter = () => {

    const dispatch = useAppDispatch();

    const user = useSelector((state: RootState) => state.user || null);
    const { people, status } = useSelector((state: RootState) => state.people)
    const [searchName, setSearchName] = useState('');
    const [searchSurname, setSearchSurname] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [filteredPeople, setFilteredPeople] = useState<User[]>([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [sortedPeople, setSortedPeople] = useState<User[]>([]);
    const [sortType, setSortType] = useState(SORT_TYPES[0].key);

    React.useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    useEffect(() => {
      const fetchDistricts = async () => {
          const response = await axios.get('https://api-rubin.multfilm.tatar/api/districts');
          setDistrictOptions([{id: 0, title: 'Не указан'}, ...response.data]);
      }
      fetchDistricts();
  }, [])

    useEffect(() => {
        setFilteredPeople(people.filter((p) => p.id !== user?.user?.id));
    }, [people, user?.user?.id]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
        if (e.target.value === '') {
            setFilteredPeople(people.filter((p) => p.id !== user?.user?.id));
        }
    };

    const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSurname(e.target.value);
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
                const matchesSchool = schoolName ? p.school?.toLowerCase() === schoolName.toLowerCase().trim() : true;
                const matchesName = searchName ? p.name.toLowerCase().includes(searchName.toLowerCase().trim()) : true;
                const matchesSurname = searchSurname ? p.surname.toLowerCase().includes(searchSurname.toLowerCase().trim()) : true;
                const matchesCity = district && district !== 'Не указан' ? p.district?.title.toLowerCase().includes(district.toLowerCase()) : true;
                return matchesSchool && matchesName && matchesSurname && matchesCity;
            })
            .filter((p) => p.school !== null || !schoolName);

        setFilteredPeople(filtered);
    };

    useEffect(() => {

      setSortedPeople(() => {
        switch (sortType) {

          case ESortTypes.activity:
            return getMostActiveUsers(filteredPeople, filteredPeople.length);

          case ESortTypes.popularity:
            return getMostPopularityUsers(filteredPeople);

          case ESortTypes.rating:
            return sortByRating(filteredPeople);
        }

        return filteredPeople
      })

    }, [filteredPeople, sortType])

    if (!filteredPeople) {
        return <p>Loading...</p>;
    }

    return (
        <div className={`page`}>
            <div className={`section shadowBlock ${styles.filterBlock}`}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    
                    <h2>Поиск пользователей</h2>

                    <div className={styles.form_inputField}>
                        <div className={styles.input}>
                            <label htmlFor="searchFilter">Имя</label>
                            <div className={styles.searchBar}>
                                <img src={loupe} alt=""/>
                                <input type="text" id='searchFilter' value={searchName} onChange={handleNameChange} placeholder='Введите имя пользователя'/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.form_inputField}>
                        <div className={styles.input}>
                            <label htmlFor="searchFilter">Фамилия</label>
                            <div className={styles.searchBar}>
                                <img src={loupe} alt=""/>
                                <input type="text" id='searchFilter' value={searchSurname} onChange={handleSurnameChange} placeholder='Введите фамилию пользователя'/>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.form_inputField}>
                        <div className={styles.input}>
                            <label htmlFor="sortFilter">Город (район)</label>
                            <div className={styles.selectBar}>
                                <select name="district" className={styles.form_select}
                                  value={city}
                                  onChange={e => {
                                      const selectedId = e.target.value
                                      setCity(districtOptions.find(district => district.id === selectedId)?.title);
                                      setDistrict(districtOptions.find(district => district.id === +selectedId)?.title);
                                  }}
                                  size={1} >
                                  {districtOptions.map((value, index) => (
                                      <option
                                          key={index}
                                          value={value.id}
                                      >
                                          {value.title}
                                      </option>
                                  ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.form_inputField}>
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
                    <img src="/images/people_page_search.png" alt=""/>
                </div>
            </div>
            <div className={styles.people_wrapper}>
              
                <div className={styles.section_header} >
                    <div className='section__title'>Пользователей</div>
                    <div className='section__counter'>{sortedPeople.length}</div>
                    <UsersSortSelect setSortType={setSortType} />
                </div>

                <div className={`section__body`}>
                    <Grid totalItems={sortedPeople.length} itemsPerPage={24} >
                        {sortedPeople && sortedPeople.map((user: User) => (
                            <FoundUserCard key={user.id} image={user.avatar} name={user.name} surname={user.surname} level={user.level} rubick={user.rubick} id={user.id}/>
                        ))}
                    </Grid>
                </div>

            </div>
        </div>
    )
}

interface UsersSortSelectProps {
  setSortType: React.Dispatch<React.SetStateAction<ESortTypes>>
}
const UsersSortSelect = ({ setSortType }: UsersSortSelectProps) => {

  const [value, setValue] = useState(SORT_TYPES[0])
  const [active, setActive] = useState(false)

  const selectValue = ( elem: typeof SORT_TYPES[0] ) => {
    setValue(elem)
    setActive(false)
    setSortType(elem.key)
  }

  return (
    <div className={styles.users_sort} >

      <div
        className={classNames(styles.value, active ? styles._active : '')}
        onClick={() => setActive(prev => !prev)}
      >
        {value.value}
      </div>

      <div className={styles.select} >
        {SORT_TYPES.map(elem => (
          <div
            key={elem.key}
            onClick={() => selectValue(elem)}
            className={elem.key === value.key ? styles._active : ''}
          >
            {elem.value}
          </div>
        ))}
      </div>

    </div>
  )
}


const getMostPopularityUsers = ( users: User[] ) => {

  const sorted = [...users].sort((a, b) => b.posts.length - a.posts.length);
  
  return sorted
}

const sortByRating = ( users: User[] ) => {

  const sorted = [...users].sort((a, b) => b.posts.length - a.posts.length);
  
  return sorted
}

export default UsersFilter;
