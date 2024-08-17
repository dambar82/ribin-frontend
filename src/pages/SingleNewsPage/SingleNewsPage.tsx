import {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from 'react-router-dom';
import {AppDispatch, RootState} from "../../store/store";

import styles from "./SingleNewsPage.module.scss"


import likeIcon from "../../images/svg/likes.svg";
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

import {fetchNewsAndNewsBack} from "../../store/newsSlice";
import { fetchPhotoGalleryById } from '../../store/photoGallerySlice';

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

const SingleNewsPage = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams();

    const { status, news } = useSelector((state: RootState) => state.news);

    const singleNews = news.find(item => item.id.toString() === id);

    useEffect(() => {
        console.log(singleNews);
        console.log(id);
        console.log(news);
    }, [singleNews, news]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNewsAndNewsBack());
        }
    }, [status, dispatch]);

    return (
        <div className="page">
            <div className={styles.news}>
                <div className={styles.news__cover}>
                    {
                        //@ts-ignore
                        <img src={singleNews.images[0]} alt="" />
                    }
                </div>
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
                                <p>
                                    {
                                        //@ts-ignore
                                        singleNews.full_content
                                    }
                                </p>
                        </div>
                        <div className={styles.news__footer}>
                            {//@ts-ignore
                                <Tag icon={likeIcon} count={singleNews.likes_count}/>
                            }
                            <Tag icon={sharedIcon} count={12} />
                            <div className={styles.news__author}>
                                <div className={styles.news__authorAvatar}>
                                    <img src="/images/news-author.png" alt="" />
                                </div>
                                <div className={styles.news__authorPosition}>Автор</div>
                                <div className={styles.news__authorName}>Алия Газизова</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.news__actions}>
                        <button className={styles.news__favorite} type="button">
                            <img src={favoriteIcon} alt="" />
                        </button>
                        <button className={styles.news__share} type="button">
                            <img src={shareIcon} alt="" />
                        </button>
                    </div>
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
                            >
                                {news.map((newsItem, index) => {
                                    // Проверяем, есть ли у newsItem свойство imagePreviewResized
                                    if ('imagePreviewResized' in newsItem) {
                                        // Теперь TypeScript знает, что newsItem имеет тип News
                                        return (
                                            <SwiperSlide key={newsItem.id}>
                                                <Link to={newsItem.url} target="_blank" rel="noopener noreferrer">
                                                    <NewsCard
                                                        title={newsItem.title}
                                                        date={newsItem.publishDate}
                                                        image={newsItem.imagePreviewResized}
                                                        newsBack={false}
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
