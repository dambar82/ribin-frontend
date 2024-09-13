import {Link, useNavigate} from "react-router-dom";

import c from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useEffect, useState} from "react";
import {fetchPostsByUserId} from "../../store/postSlice";
import {useAppDispatch} from "../../store/hooks";
import { classNames } from "../../shared/utils"

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { posts, status, error } = useSelector((state: RootState) => state.post);
    const user = useSelector((state: RootState) => state.user);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(user.user);
        if (currentUser) {
            console.log(currentUser);
            dispatch(fetchPostsByUserId({userId: user.user.id}));
        }
    }, [dispatch, user]);


    if (status === 'loading' || !currentUser) {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <section className="page">
            <section className="big-card">
                <div className={classNames('big-card__cover', c.big_card_cover)}>
                    <img src="/images/profile-cover.png" alt="" />
                </div>
                <div className="big-card__content">
                    <div className="big-card__avatar big-card__avatar--profile">
                        <picture>
                            <img src="/images/profile-avatar.png" alt="" />
                        </picture>
                        <div className="big-card__avatar-status"></div>
                    </div>
                    <div className="big-card__info">
                        <div className="big-card__info-header">
                            <div>
                                <h1 className="big-card__title">{currentUser.name} {currentUser.surname}</h1>
                                <div className="big-card__level">Рубиков <span>{currentUser.rubick}</span></div>
                            </div>
                            <div className="big-card__actions">
                                <Link to="/profile/edit">
                                    <button className="button button--main" type="button">
                                        <span>Редактировать профиль</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="big-card__info-body">
                            <div className="big-card__info-desc">
                                <p>Описание отсутствует</p>
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
                <Wall type="profile" posts={posts}/>
            </section>

        </section>
    )
}

export default ProfilePage
