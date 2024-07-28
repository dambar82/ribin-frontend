import styles from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';

const UserProfilePage = () => {
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
                                <h1 className="big-card__title">Андрей Андрюшкин</h1>
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
                <Wall 
                    type="profile" 
                    editable={false}
                    posts={[
                        { 
                            name: "Андрей Андрюшкин", 
                            avatar: "/images/user-avatar.png",
                            image: '/images/user-post-03.png', 
                            content: <p>Сегодня на тренировке у нас было очень весело! Мы победили в игре и сделали много забросов!</p>
                        },
                        { 
                            name: 'Андрей Андрюшкин', 
                            avatar: "/images/user-avatar.png",
                            content: <p>Ребята, не забывайте про разминку перед тренировкой! Наш тренер всегда говорит, что это очень важно для того, чтобы избежать травм и быть готовыми к игре на 100%. Мы обычно делаем бег, растяжку и лёгкие упражнения. А как вы разминкаетесь?</p>
                        },
                        { 
                            name: 'Андрей Андрюшкин',
                            avatar: "/images/user-avatar.png",
                            image: '/images/user-post-04.png',
                            content: <p>Наш новый тренер просто потрясающий! Сегодняшняя тренировка была на высоте, узнали много нового! Мы изучили новые техники и провели тактические упражнения, которые помогут нам в предстоящих играх. Чувствую, что наша команда становится сильнее с каждым днем!</p>
                        },
                    ]}
                />
            </section>
        </div>
    )
}

export default UserProfilePage