import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from 'react-router-dom';
import {AppDispatch, RootState} from "../../store/store";

import styles from "./SingleNewsPage.module.scss"

import likeIconBlack from '../../images/svg/likes.svg'
import likeIcon from "../../images/svg/likeIconNews.svg";
import likeIconLiked from "../../images/svg/likes_red.svg";
import sharedIcon from "../../images/svg/shared.svg"
import viewIcon from "../../images/svg/views.svg"
import calendarIcon from "../../images/svg/calendar.svg"
import favoriteIcon from "../../images/svg/favorite.svg"
import shareIcon from "../../images/svg/share.svg"
import buttonArrow from "../../images/svg/button_arrow.svg"

import NewsCard from "../../components/NewsCard/NewsCard";
import Tag from "../../components/Tag/Tag"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import CircularProgress from "@mui/material/CircularProgress";

import {addViewNews, fetchNewsAndNewsBack, newsLikeAsync} from "../../store/newsSlice";
import { fetchPhotoGalleryById } from '../../store/photoGallerySlice';
import {Box} from "@mui/material";

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

const SingleNewsPage = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams();

    const { status, news, error } = useSelector((state: RootState) => state.news);

    const user = useSelector((state: RootState) => state.user);

    const singleNews = news.find(item => item.id.toString() === id);
    // @ts-ignore
    const [isLiked, setIsLiked] = useState(false);
    // @ts-ignore
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        if (singleNews && user.user) {
            dispatch(addViewNews({newsId: singleNews.id}));
            // @ts-ignore
            setIsLiked(singleNews.liked_by.includes(user.user.id))
            // @ts-ignore
            setLikes(singleNews.likes_count);
        }
    }, [singleNews, news, user]);


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNewsAndNewsBack());
        }
    }, [status, dispatch]);

    const handleLikeClick = () => {
        console.log('liked');
        if (!isLiked) {
            dispatch(newsLikeAsync({newsId: singleNews.id}))
            setLikes(likes + 1);
            setIsLiked(true);
        }
    }

    useEffect(() => {
        //@ts-ignore
        console.log(singleNews)
    }, [singleNews])

    if (status === 'loading' || !singleNews) {
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
            <div className={styles.news}>
                <div className={styles.news__innerWrapper}>
                    <div className={styles.news__info}>
                        <h1 className={styles.news__title}>{singleNews.title}</h1>
                        <div className={styles.news__subheader}>
                            {
                                //@ts-ignore
                                <Tag icon={calendarIcon} count={formatDate(singleNews.date)}/>
                            }
                            {
                                //@ts-ignore
                                <Tag icon={viewIcon} count={singleNews.count_views}/>
                            }
                        </div>
                        <div className={styles.news__text}>
                                <div
                                    dangerouslySetInnerHTML={{
                                            //@ts-ignore
                                            __html: singleNews.full_content
                                        }}
                                >
                                </div>

                            {//@ts-ignore
                                singleNews?.video && (
                                    <div style={{marginTop: '20px'}}>
                                        {// @ts-ignore
                                            <video src={singleNews.video} controls></video>
                                        }
                                    </div>
                            )
                            }
                        </div>
                        {/*<div className={styles.news__cover}>*/}
                        {/*    {*/}
                        {/*        //@ts-ignore*/}
                        {/*        <img style={{maxHeight: '800px'}} src={singleNews.images[0]} alt="" />*/}
                        {/*    }*/}
                        {/*</div>*/}
                        <div className={styles.news__footer}>
                            {
                                user.user && (
                                    //@ts-ignore
                                    <div className={styles.tag} onClick={handleLikeClick}>
                                        <div className={styles.tag__icon}>
                                            <img src={isLiked ? likeIconLiked : likeIconBlack} alt="" />
                                        </div>
                                        <span className={`${styles.tag__label} ${isLiked ? styles.tag__label_liked : ''}`}>
                                        {likes}
                                    </span>
                                    </div>
                                )
                            }
                            {/*<Tag icon={sharedIcon} count={12} />*/}
                            <div className={styles.news__author}>
                                <div className={styles.news__authorAvatar}>
                                    <img src="/images/ава.png" alt="" />
                                </div>
                                <div className={styles.news__authorPosition}>Автор</div>
                                <div className={styles.news__authorName}>Руби</div>
                            </div>
                        </div>
                    </div>
                    {
                        user.user && (
                            <div className={styles.news__actions}>
                                <button className={styles.news__favorite} type="button" onClick={handleLikeClick}>
                                    <img src={isLiked ? likeIconLiked : likeIcon} alt="" />
                                </button>
                                <button className={styles.news__share} type="button">
                                    <img src={shareIcon} alt="" />
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            <section className={`section ${styles.moreNews}`}>
                <div className="section__header">
                    <h2 className="section__title">Читать также</h2>
                </div>
                <div className={`section__body ${styles.moreNews__body}`}>
                {
                    news.length
                    ? (
                        <>
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={3}
                                modules={[Navigation]}
                                navigation={{
                                    prevEl: '.button--prev',
                                    nextEl: '.button--next'
                                }}
                                style={{
                                    minWidth: 0,
                                    width: "100%"
                                }}
                                breakpoints={{
                                  1600: {
                                    slidesPerView: 4
                                  },
                                  1200: {
                                    slidesPerView: 3
                                  },
                                  768: {
                                    slidesPerView: 2
                                  },
                                  340: {
                                    slidesPerView: 1
                                  }
                                }}
                            >
                                {news
                                    .filter(newsItem => newsItem.id !== Number(id))
                                    .map((newsItem, index) => {
                                    if ('imagePreviewResized' in newsItem) {
                                        return (
                                            <SwiperSlide key={newsItem.id}>
                                                <Link to={`/news/api/${newsItem.id}`}>
                                                    <NewsCard
                                                        title={newsItem.title}
                                                        date={newsItem.publishDate}
                                                        image={newsItem.imagePreviewResized}
                                                        newsBack={false}
                                                        isFixed={false}
                                                    />
                                                </Link>
                                            </SwiperSlide>
                                        );
                                    } else {
                                        // Здесь newsItem обрабатывается как NewsBack
                                        return (
                                            <SwiperSlide key={newsItem.id}>
                                                <Link key={newsItem.id} to={`/news/${newsItem.id}`}>
                                                    <NewsCard
                                                        date={newsItem.date}
                                                        image={newsItem.images[0]}
                                                        title={newsItem.title}
                                                        newsBack={true}
                                                        isFixed={false}
                                                    />
                                                </Link>
                                            </SwiperSlide>
                                        );
                                    }
                                })}
                            </Swiper>
                            <div className={styles.moreNews__controls}>
                                <button className={`button button--black button--prev ${styles.moreNews__more}`} type="button">
                                    <span>Предыдущие</span>
                                    <img src={buttonArrow} alt="" />
                                </button>
                                <button className={`button button--black button--next ${styles.moreNews__more}`} type="button">
                                    <span>Показать ещё</span>
                                    <img src={buttonArrow} alt="" />
                                </button>
                            </div>
                        </>
                    ) : null
                }
                </div>
            </section>
        </div>
    )
}

export default SingleNewsPage
