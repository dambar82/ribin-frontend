import React, {useEffect, useState} from 'react';
import {fetchPeople} from "../../store/peopleSlice";
import {fetchFriends, TFriend} from "../../store/friendsSlice";
import {useSelector} from "react-redux";
import {Swiper, SwiperSlide} from 'swiper/react';
import {RootState} from "../../store/store";
import {useAppDispatch} from "../../store/hooks";
import {Link, useParams} from "react-router-dom";
import {User} from "../../store/userSlice";
import {Navigation} from 'swiper/modules'
import styles from './FriendsPage.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import buttonArrow from "../../images/svg/button_arrow.svg";
import access from '../../images/svg/access.svg';
import decline from '../../images/svg/decline.svg';
import threeDots from '../../images/svg/threeDots.svg';
import deleteFriend from '../../images/svg/deleteFriend.svg';
import redFlag from '../../images/svg/redflag.svg';
import question from '../../images/question.png';
import axios from "axios";
import loupeIcon from "../../images/svg/loupe.svg";
import { classNames } from '../../shared/utils'
import { Button } from '../../shared/UI'
import {Box} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


const enum ESortTypes {
  waiting='waiting',
  pending='pending',
}

const SORT_TYPES = [
  { key: ESortTypes.waiting, value: 'Входящие заявки' },
  { key: ESortTypes.pending, value: 'Отправленные заявки' }
]

const FriendsPage = () => {

    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useAppDispatch();
    const {people} = useSelector((state: RootState) => state.people)
    const {friends} = useSelector((state: RootState) => state.friends)
    const {id} = useParams();
    const [currentUser, setCurrentUser] = useState<User>(null);
    const [yourPage, setYourPage] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState(0);
    const [sortRequestsType, setSortRequestsType] = useState(ESortTypes.waiting);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleDropdown = (friendId) => {
        setOpenDropdown(prev => prev === friendId ? null : friendId);
    };

    useEffect(() => {
        dispatch(fetchPeople());
        dispatch(fetchFriends());
    }, [dispatch]);

    useEffect(() => {
        setCurrentUser(people.find(user => user.id.toString() === id));
    }, [currentUser, people])

    useEffect(() => {
        if (user && currentUser) {
            if (user.id === currentUser.id) {
                setYourPage(true);
            }
        }
    }, [currentUser, user])

    const handleCancelFriendOffer = async (event: any, receiverId: number) => {
        event.preventDefault();

        let token;

        try {
            const storedToken = localStorage.getItem('token');
            token = JSON.parse(storedToken);

            // Проверка, если токена нет, просто присваиваем его значение null
            if (storedToken === null) {
                token = null; // Токен отсутствует
            }
        } catch (error) {
            console.error('Ошибка при получении токена:', error);
        }

        const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/request/${receiverId}`

        await axios.delete(friendsUrl, {headers: {Authorization: `Bearer ${token}`}});

        dispatch(fetchFriends());
    }

    const handleDeleteFriendship = async (event: any, receiverId: number) => {
      event.preventDefault();

        let token;

        try {
            const storedToken = localStorage.getItem('token');
            token = JSON.parse(storedToken);

            // Проверка, если токена нет, просто присваиваем его значение null
            if (storedToken === null) {
                token = null; // Токен отсутствует
            }
        } catch (error) {
            console.error('Ошибка при получении токена:', error);
        }

      const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/remove/${receiverId}`;

      await axios.delete(friendsUrl, {headers: {Authorization: `Bearer ${token}`}});
      dispatch(fetchFriends());
  }

    const filteredFriends = (friendList) => {
        return friendList.filter(friend => {
            const fullName =
                friend.sender
                    ? `${friend.sender.name} ${friend.sender.surname}`.toLowerCase()
                    : `${friend.receiver.name} ${friend.receiver.surname}`.toLowerCase();


            const isOnline = friend.sender.id === currentUser.id ? friend.receiver.online : friend.sender.online;

            const nameMatch = fullName.includes(searchTerm.toLowerCase());

            if (sortType === 1) {
                return nameMatch && isOnline;
            }
            return nameMatch;
        });
    };

    const filteredCurrentUserFriends = currentUser?.friends.filter(friend => {
        const fullName = `${friend.name} ${friend.surname}`.toLowerCase();
        //@ts-ignore
        const isOnline = friend.online; // Добавляем проверку на онлайн

        const nameMatch = fullName.includes(searchTerm.toLowerCase());

        if (sortType === 1) {
            return nameMatch && isOnline; // Фильтрация только онлайн-друзей
        }

        return nameMatch; // Фильтрация всех друзей
    });

    useEffect(() => {
        console.log(friends)
    }, [friends])

    if (!currentUser)
        return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
            }}
        >
            <CircularProgress
                size="3rem"
                sx={{ color: '#91172C' }}
            />
        </Box>
    )

    return (
        <div className={`page ${styles.page}`}>
            {
                yourPage && (friends.awaiting.length > 0 || friends.pending.length > 0) && (
                    <>
                        <section className={`section`}>
                            <div className="section__header">
                                <h2 className="section__title">Заявки в друзья</h2>
                                <div className='section__counter'>{
                                    sortRequestsType === ESortTypes.waiting ?
                                    friends.awaiting.length : friends.pending.length
                                }</div>
                                <UsersSortSelect setSortType={setSortRequestsType} />
                            </div>
                            <div className={`section__body userList`} style={{padding: '70px 150px'}}>
                                <UsersSlider
                                  friends={sortRequestsType === ESortTypes.waiting
                                    ? friends.awaiting
                                    : friends.pending
                                  }
                                  sended={sortRequestsType === ESortTypes.pending}
                                  currentUser={currentUser}
                                  handleDeleteFriendship={handleDeleteFriendship}
                                  handleCancelFriendOffer={handleCancelFriendOffer}
                                />
                            </div>
                        </section>
                    </>
                )
            }
            <div className='section__header'>
                <div className='section__title'>
                    {
                        yourPage ? 'Мои друзья' : `Друзья`
                    }
                </div>
                <div className='section__counter'>{currentUser.friends.length}</div>
            </div>
            {currentUser.friends.length > 0 && (
                <div className={`userList`}>
                    <div className={`userList_list`}>
                        {
                            yourPage ? (
                                filteredFriends(friends.friends).map(friend => (
                                    friend.sender.id !== currentUser.id ? (
                                        <Link to={`/user/${friend.sender.id}`} key={friend.sender.id}>
                                            <div className={styles.friendBlock}>
                                                <div className={styles.friendBlock_avatar}>
                                                    <img src={friend.sender.avatar} alt=""/>
                                                    {friend.sender.online && (
                                                        <div style={{right: '-5px', bottom: '5px', width: '16px', height: '16px'}} className="big-card__avatar-status"></div>
                                                    )}
                                                </div>
                                                <div className={styles.friendBlock_info}>
                                                    <div className={styles.friendBlock_info_name}>
                                                        {friend.sender.name} {friend.sender.surname}
                                                    </div>
                                                    <div className='levelButton' style={{width: '128px'}}>
                                                        Рубиков <span>{friend.sender.rubick}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.friendBlock_buttons}>
                                                    <div className={styles.friendBlock_buttons_threeDot} onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleDropdown(friend.sender.id);
                                                    }}>
                                                        <img src={threeDots} alt=""/>
                                                    </div>
                                                    {openDropdown === friend.sender.id && (
                                                        <div className={styles.dropdownMenu}>
                                                            <button onClick={(event) => handleDeleteFriendship(event, friend.sender.id)}>
                                                                <img src={deleteFriend} alt=""/>
                                                                Удалить из друзей
                                                            </button>
                                                            {/*<button onClick={() => console.log('Пожаловаться')}>*/}
                                                            {/*    <img src={redFlag} alt=""/>*/}
                                                            {/*    Пожаловаться*/}
                                                            {/*</button>*/}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link to={`/user/${friend.receiver.id}`} key={friend.receiver.id}>
                                            <div className={styles.friendBlock}>
                                                <div className={styles.friendBlock_avatar}>
                                                    <img src={friend.receiver.avatar} alt=""/>
                                                    {friend.receiver.online && (
                                                        <div style={{right: '-5px', bottom: '5px', width: '16px', height: '16px'}} className="big-card__avatar-status"></div>
                                                    )}
                                                </div>
                                                <div className={styles.friendBlock_info}>
                                                    <div className={styles.friendBlock_info_name}>
                                                        {friend.receiver.name} {friend.receiver.surname}
                                                    </div>
                                                    <div className='levelButton' style={{width: '128px'}}>
                                                        Рубиков <span>{friend.receiver.rubick}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.friendBlock_buttons}>
                                                    <div className={styles.friendBlock_buttons_threeDot} onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleDropdown(friend.receiver.id);
                                                    }}>
                                                        <img src={threeDots} alt=""/>
                                                    </div>
                                                    {openDropdown === friend.receiver.id && (
                                                        <div className={styles.dropdownMenu}>
                                                            <button onClick={(event) => handleDeleteFriendship(event, friend.receiver.id)}>
                                                                <img src={deleteFriend} alt=""/>
                                                                Удалить из друзей
                                                            </button>
                                                            {/*<button onClick={() => console.log('Пожаловаться')}>*/}
                                                            {/*    <img src={redFlag} alt=""/>*/}
                                                            {/*    Пожаловаться*/}
                                                            {/*</button>*/}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                ))
                            ) : (
                                filteredCurrentUserFriends.map(friend => (
                                    <Link to={`/user/${friend.id}`}>
                                        <div className={styles.friendBlock}>
                                            <div className={styles.friendBlock_avatar}>
                                                <img src={`https://api-rubin.multfilm.tatar/storage/${friend.avatar}`} alt=""/>
                                                {friend.online && (
                                                    <div style={{right: '-5px', bottom: '5px', width: '16px', height: '16px'}} className="big-card__avatar-status"></div>
                                                )}
                                            </div>
                                            <div className={styles.friendBlock_info}>
                                                <div className={styles.friendBlock_info_name}>
                                                    {friend.name} {friend.surname}
                                                </div>
                                                <div className='levelButton' style={{width: '128px'}}>
                                                    Рубиков <span>{friend.rubick}</span>
                                                </div>
                                            </div>
                                            <div className={styles.friendBlock_buttons}>
                                                <div className={styles.friendBlock_buttons_threeDot} onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleDropdown(friend.id);
                                                }}>
                                                    <img src={threeDots} alt=""/>
                                                </div>
                                                {openDropdown === friend.id && (
                                                    <div className={styles.dropdownMenu}>
                                                        { yourPage && (
                                                            <button onClick={(event) => handleDeleteFriendship(event, friend.id)}>
                                                                <img src={deleteFriend} alt=""/>
                                                                Удалить из друзей
                                                            </button>
                                                        ) }
                                                        {/*<button onClick={() => console.log('Пожаловаться')}>*/}
                                                        {/*    <img src={redFlag} alt=""/>*/}
                                                        {/*    Пожаловаться*/}
                                                        {/*</button>*/}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )
                        }
                    </div>
                    <div className={styles.usersFilter}>
                        <form action="#" className={styles.wall__form}>
                            <button type="button">
                                <img src={loupeIcon} alt="" />
                            </button>
                            <input
                                type="text"
                                placeholder='Поиск'
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </form>
                        <div className={styles.wall__filter}>
                            {["Все друзья", "Онлайн"].map((item, index) => (
                                <button
                                    key={item + index}
                                    className={sortType === index ? `${styles.wall__filterItem} ${styles.wall__filterItemActive}` : styles.wall__filterItem}
                                    type="button"
                                    onClick={() => setSortType(index)}
                                >{item}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface UsersSliderProps {
  friends: any[]
  currentUser: User
  sended: boolean
  handleDeleteFriendship: (
    event: any,
    id: number
  ) => void,
  handleCancelFriendOffer: (
      event: any,
      id: number
  ) => void
}
const UsersSlider = ({ friends, currentUser, sended, handleDeleteFriendship, handleCancelFriendOffer }: UsersSliderProps) => {

    console.log('friends', friends);
  const dispatch = useAppDispatch();

  const handleAcceptFriendship = async (event:any, friendship: number) => {
    event.preventDefault();
    const config: any = {}
    const token = JSON.parse(localStorage.getItem('token') || '')

    const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/accept/${friendship}`;

    const response = await axios.post(friendsUrl, {friendshipId: friendship}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    dispatch(fetchFriends());
  }

  if ( !friends || friends.length === 0 ) {
    return (
      <div className={styles.illustration}>
        <img src={question} alt=""/>
        <p>
            Тут пока тихо...
        </p>
      </div>
    )
  }

  return (<>
        <Swiper
            spaceBetween={20}
            modules={[Navigation]}
            navigation={{
                prevEl: '.button--prev',
                nextEl: '.button--next'
            }}
            style={{
                width: "100%",
            }}
            breakpoints={{
                1200: {
                    slidesPerView: 4
                },
                768: {
                    slidesPerView: 3
                },
                480: {
                    slidesPerView: 2
                },
                360: {
                    slidesPerView: 1
                }
            }}
        >
            {[...friends]
                .sort((a, b) => b.rubick - a.rubick)
                .map((friend, index) => {
                    return (
                        <SwiperSlide key={friend.id}>
                            {
                                friend.sender.id === currentUser.id ? (
                                    <Link to={`/user/${friend.receiver.id}`}>
                                        <div className={styles.awaitingFriend}>
                                            <div className={styles.awaitingFriend_avatar}>
                                                <img src={friend.receiver.avatar} alt=""/>
                                                {friend.receiver.online && (
                                                    <div style={{right: 0, bottom: '5px'}} className="big-card__avatar-status"></div>
                                                )}
                                            </div>
                                            <div className={styles.awaitingFriend_name}>
                                                {friend.receiver.name} {friend.receiver.surname}
                                            </div>
                                            <div className="levelButton" style={{marginTop: '12px'}}>
                                                Рубиков <span>{friend.receiver.rubick}</span>
                                            </div>
                                            {!sended &&
                                                <div className={styles.awaitingFriend_buttons}>
                                                    <div
                                                        onClick={(event) => handleAcceptFriendship(event, friend.id)}
                                                        className={`${styles.awaitingFriend_button} ${styles.awaitingFriend_buttonAccept}`}>
                                                        <img src={access} alt=""/>
                                                    </div>
                                                    <div
                                                        onClick={(event) => handleDeleteFriendship(event, friend.receiver.id)}
                                                        className={`${styles.awaitingFriend_button} ${styles.awaitingFriend_buttonDecline}`}>
                                                        <img src={decline} alt=""/>
                                                    </div>
                                                </div>
                                            }
                                            {sended &&
                                                <div className={styles.awaitingFriend_buttons}>
                                                    <Button
                                                        type='button'
                                                        onClick={e => handleCancelFriendOffer(e, friend.receiver.id)}
                                                    >
                                                        Отменить
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </Link>
                                ) : (
                                    <Link to={`/user/${friend.id}`}>
                                        <div className={styles.awaitingFriend}>
                                            <div className={styles.awaitingFriend_avatar}>
                                                <img src={friend.sender.avatar} alt=""/>
                                                {friend.sender.online && (
                                                    <div style={{right: 0, bottom: '5px'}} className="big-card__avatar-status"></div>
                                                )}
                                            </div>
                                            <div className={styles.awaitingFriend_name}>
                                                {friend.sender.name} {friend.sender.surname}
                                            </div>
                                            <div className="levelButton" style={{marginTop: '12px'}}>
                                                Рубиков <span>{friend.sender.rubick}</span>
                                            </div>
                                            {!sended &&
                                                <div className={styles.awaitingFriend_buttons}>
                                                    <div
                                                        onClick={(event) => handleAcceptFriendship(event, friend.id)}
                                                        className={`${styles.awaitingFriend_button} ${styles.awaitingFriend_buttonAccept}`}>
                                                        <img src={access} alt=""/>
                                                    </div>
                                                    <div
                                                        onClick={(event) => handleDeleteFriendship(event, friend.sender.id)}
                                                        className={`${styles.awaitingFriend_button} ${styles.awaitingFriend_buttonDecline}`}>
                                                        <img src={decline} alt=""/>
                                                    </div>
                                                </div>
                                            }
                                            {sended &&
                                                <div className={styles.awaitingFriend_buttons}>
                                                    <Button
                                                        type='button'
                                                        onClick={e => handleCancelFriendOffer(e, friend.receiver.id)}
                                                    >
                                                        Отменить
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </Link>
                                )
                            }
                        </SwiperSlide>
                    );
                })}
        </Swiper>
        <div className={styles.swiper_controls}>
            <button className={`button button--black button--prev ${styles.swiper_controls__more}`}
                    type="button">
                <span>Предыдущие</span>
                <img src={buttonArrow} alt=""/>
            </button>
            <button className={`button button--black button--next ${styles.swiper_controls__more}`}
                    type="button">
                <span>Показать ещё</span>
                <img src={buttonArrow} alt=""/>
            </button>
        </div>
    </>)
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

export default FriendsPage;