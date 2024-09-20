import styles from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';
import {useAppDispatch} from "../../store/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchPostsByUserId} from "../../store/postSlice";
import {fetchPeople, sendFriendRequest} from "../../store/peopleSlice";
import {User} from "../../store/userSlice";
import { classNames } from "../../shared/utils"
import {fetchFriends} from "../../store/friendsSlice";

const UserProfilePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { people } = useSelector((state: RootState) => state.people)
    const { friends } = useSelector((state: RootState) => state.friends)
    const { posts, status, error } = useSelector((state: RootState) => state.post);
    const user = useSelector((state: RootState) => state.user.user);
    const [currentUser, setCurrentUser] = useState<User>(null);
    const [requestSent, setRequestSent] = useState(false);
    const [yourPage, setYourPage] = useState(false);

    useEffect(() => {
        dispatch(fetchPeople());
        dispatch(fetchFriends());
    }, [dispatch]);

    useEffect(() => {
        if (currentUser) {
            if (friends.pending.some(element =>
                element.receiver_id === currentUser.id
            )) {
                setRequestSent(true);
            }
        }
    }, [friends, currentUser])

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

     useEffect(() => {
         dispatch(fetchPostsByUserId({userId: Number(id)}));
      }, [dispatch])

    const handleFriendAdd = async () => {
        if (!requestSent) {
            const friendRequest = await dispatch(sendFriendRequest({receiverId: currentUser.id}));
            if (friendRequest.payload === 'Запрос на дружбу отправлен.') {
                setRequestSent(true);
            }
        } else {

        }
    }


    if (status === 'loading' || !currentUser) {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className="page">
            <section className="big-card">
                <div className="big-card__cover">
                    <img src={currentUser.image} alt="" />
                </div>
                <div className="big-card__content">
                    <div className="big-card__avatar">
                        <picture>
                            <img src={currentUser.avatar} alt="" />
                        </picture>
                        {currentUser.online && (
                            <div className="big-card__avatar-status"></div>
                        )}
                    </div>
                    <div className="big-card__info">
                        <div className="big-card__info-header">
                            <div>
                                <h1 className="big-card__title">{currentUser.name} {currentUser.surname}</h1>
                                <div className="big-card__level">Рубиков <span>{currentUser.rubick}</span></div>
                            </div>
                            {
                                yourPage ? (
                                    <div className="big-card__actions">
                                        <Link to={`/user/${currentUser.id}/edit`}>
                                            <button className="button button--main" type="button">
                                                <span>Редактировать профиль</span>
                                            </button>
                                        </Link>
                                    </div>
                                    ) : (
                                    <div className="big-card__actions">
                                        <Link to={`/chat/${user.id}`}>
                                        <button className="button button--main-outlined" type="button">
                                            <span>Написать сообщение</span>
                                        </button>
                                        </Link>
                                        {currentUser.friends.find(el => el.id === user.id)
                                        ?
                                          <button className={classNames('button', 'button--main', styles.added_friend_button)} type="button" >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            <span>В друзьях</span>
                                          </button>
                                        :
                                          <button className="button button--main" type="button" onClick={handleFriendAdd}>
                                            <span>{requestSent ? 'Запрос отправлен' : 'Добавить в друзья'}</span>
                                          </button>
                                        }
                                    </div>
                                )
                            }
                        </div>
                        <div className="big-card__info-body">
                            <div className="big-card__info-desc">
                                <p>{currentUser.description}</p>
                            </div>
                        </div>
                        <div className="big-card__info-footer">
                            {currentUser.friends.length > 0 && (
                                <Link to={`/user/${currentUser.id}/friends`}>
                                    <div className="big-card__users">
                                        <ul className="big-card__users-list">
                                            {currentUser.friends.map(item => (
                                                <li key={item.id} className="big-card__user">
                                                    <img src={`https://api-rubin.multfilm.tatar/storage/${item.avatar}`} alt="" />
                                                </li>
                                            ))}
                                        </ul>
                                            <div className="big-card__users-qty">
                                                <div className="big-card__users-qty_friends">Друзья</div>
                                                {currentUser.friends.length > 5 && (
                                                    <div className="big-card__users-qty_friendsCount">
                                                        {currentUser.friends.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                {yourPage ? (
                    <Wall
                        type="profile"
                        // editable={false}
                        posts={posts}
                    />
                ): (
                    <Wall
                        type="profile"
                        editable={false}
                        posts={posts}
                    />
                )}
            </section>
        </div>
    )
}

export default UserProfilePage
