import styles from "./PostsPage.module.scss"

import Wall from "../../components/Wall/Wall"
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch} from "../../store/hooks";
import {useEffect} from "react";
import {fetchComplaintTypes, fetchPosts} from "../../store/postSlice";
import {Box} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const PostsPage = () => {
    const dispatch = useAppDispatch();
    const { posts, status, error } = useSelector((state: RootState) => state.post);

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchComplaintTypes())
    }, [dispatch]);

    if (status === 'loading') {
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
    }

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
            </section>
        </div>
    )
}

export default PostsPage
