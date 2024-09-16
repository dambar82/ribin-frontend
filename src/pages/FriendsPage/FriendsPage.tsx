import React, {useEffect, useState} from 'react';
import {fetchPeople} from "../../store/peopleSlice";
import {fetchFriends} from "../../store/friendsSlice";
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
import axios from "axios";

const FriendsPage = () => {

    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useAppDispatch();
    const {people} = useSelector((state: RootState) => state.people)
    const {friends} = useSelector((state: RootState) => state.friends)
    const {id} = useParams();
    const [currentUser, setCurrentUser] = useState<User>(null);
    const [yourPage, setYourPage] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

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
        console.log(currentUser)
        if (user && currentUser) {
            if (user.id === currentUser.id) {
                setYourPage(true);
            }
        }
    }, [currentUser, user])

    const handleAcceptFriendship = async (event, friendship: number) => {
        event.preventDefault();
        const config: any = {}
        const token = JSON.parse(localStorage.getItem('token') || '')

        const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/accept/${friendship}`;

        await axios.post(friendsUrl, {friendshipId: friendship}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch(fetchFriends());
    }

    const handleDeleteFriendship = async (event, receiverId: number) => {
        event.preventDefault();
        const token = JSON.parse(localStorage.getItem('token') || '')

        const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/remove/${receiverId}`;

        await axios.delete(friendsUrl, {headers: {Authorization: `Bearer ${token}`}});
        dispatch(fetchFriends());
    }

    useEffect(() => {
        console.log(friends);
    }, [friends])

    if (!currentUser) return <p>Loading...</p>

    return (
        <div className={`page`}>
            {
                yourPage && friends.pending.length > 0 && (
                    <>
                        <section className={`section`}>
                            <div className="section__header">
                                <h2 className="section__title">Заявки в друзья</h2>
                                <div className='section__counter'>{friends.awaiting.length}</div>
                            </div>
                            <div className={`section__body userList`}>
                                <Swiper
                                    spaceBetween={20}
                                    slidesPerView={4}
                                    modules={[Navigation]}
                                    navigation={{
                                        prevEl: '.button--prev',
                                        nextEl: '.button--next'
                                    }}
                                    style={{
                                        minWidth: 0,
                                        width: "100%"
                                    }}
                                >
                                    {[...friends.pending]
                                        .sort((a, b) => b.sender.rubick - a.sender.rubick)
                                        .map((friend, index) => {
                                            return (
                                                <SwiperSlide key={friend.id}>
                                                    <Link to={`/user/${friend.sender.id}`}>
                                                        <div className={styles.awaitingFriend}>
                                                            <div className={styles.awaitingFriend_avatar}>
                                                                <img src={friend.sender.avatar} alt=""/>
                                                            </div>
                                                            <div className={styles.awaitingFriend_name}>
                                                                {friend.sender.name} {friend.sender.surname}
                                                            </div>
                                                            <div className="levelButton" style={{marginTop: '12px'}}>
                                                                Рубиков <span>{friend.sender.rubick}</span>
                                                            </div>
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
                                                        </div>
                                                    </Link>
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
            <div className={`userList`}>
                <div className={`userList_list`}>
                    {
                        yourPage ? (
                            friends.friends.map(friend => (
                                friend.sender.id !== currentUser.id ? (
                                    <Link to={`/user/${friend.sender.id}`}>
                                        <div className={styles.friendBlock}>
                                            <div className={styles.friendBlock_avatar}>
                                                <img src={friend.sender.avatar} alt=""/>
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
                                                        <button onClick={() => console.log('Пожаловаться')}>
                                                            <img src={redFlag} alt=""/>
                                                            Пожаловаться
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    ) : (
                                    <Link to={`/user/${friend.receiver.id}`}>
                                        <div className={styles.friendBlock}>
                                            <div className={styles.friendBlock_avatar}>
                                                <img src={friend.receiver.avatar} alt=""/>
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
                                                        <button onClick={() => console.log('Пожаловаться')}>
                                                            <img src={redFlag} alt=""/>
                                                            Пожаловаться
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            ))
                            ) : (
                            currentUser.friends.map(friend => (
                                <Link to={`/user/${friend.id}`}>
                                    <div className={styles.friendBlock}>
                                        <div className={styles.friendBlock_avatar}>
                                            <img src={`https://api-rubin.multfilm.tatar/storage/${friend.avatar}`} alt=""/>
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
                                                    <button onClick={() => console.log('Пожаловаться')}>
                                                        <img src={redFlag} alt=""/>
                                                        Пожаловаться
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;