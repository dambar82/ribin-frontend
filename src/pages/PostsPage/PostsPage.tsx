import styles from "./PostsPage.module.scss"

import Wall from "../../components/Wall/Wall"
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {useCallback, useEffect, useRef, useState} from "react";
import {fetchComplaintTypes, fetchPosts} from "../../store/postSlice";

const PostsPage = () => {
    const dispatch = useAppDispatch();
    const { posts, status, error } = useSelector((state: RootState) => state.post);
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const isFirstLoad = useRef(true);
    const isFetching = useRef(false);

    useEffect(() => {
        if (!isFirstLoad.current) return; // ✅ Не загружаем заново, если уже загружали

        isFirstLoad.current = false; // После первого запроса сбрасываем флаг
        isFetching.current = true;
        dispatch(fetchPosts(page)).finally(() => {
            setTimeout(() => {
                isFetching.current = false;
            }, 300);
        });
    }, [dispatch]);


    useEffect(() => {
        console.log('page', posts)
    }, [posts])

    useEffect(() => {
        dispatch(fetchComplaintTypes());
    }, [dispatch]);

    const lastPostCallback = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !isFetching.current) {
                        isFetching.current = true;
                        setPage((prevPage) => prevPage + 1);
                        dispatch(fetchPosts(page + 1)).finally(() => {
                            setTimeout(() => {
                                isFetching.current = false;
                            }, 300);
                        });
                    }
                },
                { threshold: 1.0 }
            );

            if (node) observer.current.observe(node);
        },
        [dispatch, page]
    );

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className="page">
            <section className={`hero ${styles.hero}`}>
                <img src="images/hero-sports-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-posts-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Записи</h1>
                <p className={`${styles.hero__subtitle} hero__title`}>Пользователей</p>
            </section>
            <section>
                <Wall
                    type="post"
                    posts={posts}
                />
                <div ref={lastPostCallback} style={{ height: 20 }}/>
            </section>
        </div>
    )
}

export default PostsPage
