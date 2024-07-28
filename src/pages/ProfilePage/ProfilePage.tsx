import { Link } from "react-router-dom";

import styles from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';

const ProfilePage = () => {
    return (
        <section className="page">

            <section className="big-card">
                <div className="big-card__cover">
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
                                <h1 className="big-card__title">Иван Иванов</h1>
                                <div className="big-card__level">Уровень <span>0</span></div>
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
                                    {[1, 2, 3, 4, 5].map(item => (
                                        <li key={item} className="big-card__user">
                                            <img src={`/images/club-client-0${item}.png`} alt="" />
                                        </li>
                                    ))}
                                </ul>
                                <div className="big-card__users-qty">
                                    <div>Друзья</div>
                                    <div>+220</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <Wall type="profile" posts={[]}/>
            </section>

        </section>
    )
}

export default ProfilePage