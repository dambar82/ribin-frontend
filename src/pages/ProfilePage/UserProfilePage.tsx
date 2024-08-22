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

const UserProfilePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { people } = useSelector((state: RootState) => state.people)
    const { posts, status, error } = useSelector((state: RootState) => state.post);
    const user = useSelector((state: RootState) => state.user.user);
    const [currentUser, setCurrentUser] = useState<User>(null);
    const [yourPage, setYourPage] = useState(false);

    useEffect(() => {
        dispatch(fetchPeople());
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

     useEffect(() => {
         dispatch(fetchPostsByUserId({userId: Number(id)}));
      }, [dispatch])

    const handleFriendAdd = () => {
        dispatch(sendFriendRequest({receiverId: currentUser.id}))
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
                        <div className="big-card__avatar-status"></div>
                    </div>
                    <div className="big-card__info">
                        <div className="big-card__info-header">
                            <div>
                                <h1 className="big-card__title">{currentUser.name} {currentUser.surname}</h1>
                                <div className="big-card__level">Уровень <span>{currentUser.level}</span></div>
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
                                        <button className="button button--main-outlined" type="button">
                                            <span>Написать сообщение</span>
                                        </button>
                                        <button className="button button--main" type="button" onClick={handleFriendAdd}>
                                            <span>Добавить в друзья</span>
                                        </button>
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
                            <div className="big-card__users">
                                <ul className="big-card__users-list">
                                    {currentUser.friends.map(item => (
                                        <li key={item.id} className="big-card__user">
                                            <img src={item.avatar} alt="" />
                                        </li>
                                    ))}
                                </ul>
                                {currentUser.friends.length > 0 && (
                                    <div className="big-card__users-qty">
                                        <div className="big-card__users-qty_friends">Друзья</div>
                                        {currentUser.friends.length > 5 && (
                                            <div className="big-card__users-qty_friendsCount">
                                                {currentUser.friends.length - 5}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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
