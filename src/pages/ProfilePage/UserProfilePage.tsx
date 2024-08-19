import styles from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';
import {useAppDispatch} from "../../store/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchPostsByUserId} from "../../store/postSlice";
import {fetchPeople} from "../../store/peopleSlice";

const UserProfilePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { people } = useSelector((state: RootState) => state.people)
    const { posts, status, error } = useSelector((state: RootState) => state.post);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    useEffect(() => {
        setCurrentUser(people.find(user => user.id.toString() === id));
    }, [currentUser, people])

     useEffect(() => {
         dispatch(fetchPostsByUserId({userId: Number(id)}));
      }, [dispatch])


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
                    <img src="/images/user-cover.png" alt="" />
                </div>
                <div className="big-card__content">
                    <div className="big-card__avatar">
                        <picture>
                            <img src="/images/user-avatar.png" alt="" />
                        </picture>
                        <div className="big-card__avatar-status"></div>
                    </div>
                    <div className="big-card__info">
                        <div className="big-card__info-header">
                            <div>
                                <h1 className="big-card__title">{currentUser.name} {currentUser.surname}</h1>
                                <div className="big-card__level">Уровень <span>200</span></div>
                            </div>
                            <div className="big-card__actions">
                                <button className="button button--main-outlined" type="button">
                                    <span>Написать сообщение</span>
                                </button>
                                <button className="button button--main" type="button">
                                    <span>Добавить в друзья</span>
                                </button>
                            </div>
                        </div>
                        <div className="big-card__info-body">
                            <div className="big-card__info-desc">
                                <p>Обожаю играть в футбол и всегда рад новым друзьям. Давай играть вместе и достигать новых вершин вместе!</p>
                            </div>
                        </div>
                        <div className="big-card__info-footer">
                            <div className="big-card__users">
                                <ul className="big-card__users-list">
                                    {currentUser.friends.map(item => (
                                        <li key={item} className="big-card__user">
                                            <img src={`/images/club-client-0${item}.png`} alt="" />
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
                <Wall
                    type="profile"
                    editable={false}
                    posts={posts}
                />
            </section>
        </div>
    )
}

export default UserProfilePage
