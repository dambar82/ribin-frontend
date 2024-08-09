import styles from "./PostsPage.module.scss"

import Wall from "../../components/Wall/Wall"
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {useEffect} from "react";
import {fetchPosts} from "../../store/postSlice";

const PostsPage = () => {
    const dispatch = useAppDispatch();
    const { posts, status, error } = useSelector((state: RootState) => state.post);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className="page">
            <section className={`${styles.hero} hero`}>
                <img src="images/hero-sports-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-posts-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Записи</h1>
                <p className={`${styles.hero__subtitle} hero__title`}>Пользователей</p>
            </section>
            <section>
                <Wall
                    type="post"
                    posts={[
                        {
                            name: "Анна Иванова",
                            avatar: "/images/post-user-01.png",
                            content: <p>Сегодня на тренировке у нас было очень весело! Мы победили в игре и сделали много забросов!</p>
                        },
                        {
                            name: 'Петр Сидоров',
                            avatar: "/images/post-user-02.png",
                            content: <p>Сегодняшний матч был невероятным! Мы прошли в полуфинал чемпионата благодаря нашей командной работе! 💪💪💪</p>
                        },
                        {
                            name: 'Екатерина Петрова',
                            avatar: "/images/post-user-03.png",
                            image: '/images/user-post-01.png',
                            content: <p>Наш новый тренер просто потрясающий! Сегодняшняя тренировка была на высоте, узнали много нового! Мы изучили новые техники и провели тактические упражнения, которые помогут нам в предстоящих играх. Чувствую, что наша команда становится сильнее с каждым днем!</p>
                        },
                        {
                            name: 'Иван Козлов',
                            avatar: "/images/post-user-04.png",
                            content: <p>У нас сегодня была дружеская игра, и все играли с таким энтузиазмом! Мы разделились на команды и провели несколько матчей. Я играл в защите и смог предотвратить несколько опасных моментов. Было весело и поучительно!</p>
                        },
                        {
                            name: "Мария Николаева",
                            avatar: "/images/post-user-05.png",
                            image: '/images/user-post-02.png',
                            content: <p>Отличная статья! Приятно видеть, что команда усердно работает и готовится к новому сезону. Интересно, как тренерский штаб планирует использовать новых игроков и какие тактические изменения нас ждут. Желаю команде успехов и без травм пройти этот важный этап подготовки.</p>
                        }
                    ]}
                />
            </section>
        </div>
    )
}

export default PostsPage
