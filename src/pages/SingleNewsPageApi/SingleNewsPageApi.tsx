import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchNewsApiById} from "../../store/newsSlice";
import styles from '../SingleNewsPage/SingleNewsPage.module.scss';
import Tag from "../../components/Tag/Tag";
import calendarIcon from "../../images/svg/calendar.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import NewsCard from "../../components/NewsCard/NewsCard";
import buttonArrow from "../../images/svg/button_arrow.svg";
import 'swiper/css';
import 'swiper/css/navigation';

function convertDatetimeToDate(datetimeStr) {
    const dateStr = datetimeStr.split(' ')[0];
    return dateStr;
}

const SingleNewsPageApi = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();

    const {status, news, error} = useSelector((state: RootState) => state.news);

    useEffect(() => {
        dispatch(fetchNewsApiById({newsId: Number(id)}))
    }, [dispatch])

    const currentNews = news[0];

    if (!currentNews) {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className="page">
            <div className={styles.news}>
                {
                    //@ts-ignore
                    currentNews?.imagePreview && (
                        <div className={styles.news__cover}>
                            {
                                //@ts-ignore
                                <img src={news[0].imagePreview} alt=""/>
                            }
                        </div>
                    )
                }
                <div className={styles.news__innerWrapper}>
                    <div className={styles.news__info}>
                        <h1 className={styles.news__title}>{currentNews?.title}</h1>
                        <div className={styles.news__subheader}>
                            {
                                //@ts-ignore
                                <Tag icon={calendarIcon} count={convertDatetimeToDate(currentNews?.publishDate)}/>
                            }
                        </div>
                        <div className={styles.news__text}>
                            <div
                                dangerouslySetInnerHTML={{
                                    //@ts-ignore
                                    __html: currentNews?.body
                            }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/*<section className={`section ${styles.moreNews}`}>*/}
            {/*    <div className="section__header">*/}
            {/*        <h2 className="section__title">Читать также</h2>*/}
            {/*    </div>*/}
            {/*    <div className={`section__body ${styles.moreNews__body}`}>*/}
            {/*        {*/}
            {/*            news.length*/}
            {/*                ? (*/}
            {/*                    <>*/}
            {/*                        <Swiper*/}
            {/*                            spaceBetween={20}*/}
            {/*                            slidesPerView={3}*/}
            {/*                            modules={[Navigation]}*/}
            {/*                            navigation={{*/}
            {/*                                prevEl: '.button--prev',*/}
            {/*                                nextEl: '.button--next'*/}
            {/*                            }}*/}
            {/*                            style={{*/}
            {/*                                minWidth: 0,*/}
            {/*                                width: "100%"*/}
            {/*                            }}*/}
            {/*                        >*/}
            {/*                            {news.map((newsItem, index) => {*/}
            {/*                                if ('imagePreviewResized' in newsItem) {*/}
            {/*                                    return (*/}
            {/*                                        <SwiperSlide key={newsItem.id}>*/}
            {/*                                            <Link to={`/news/api/${newsItem.id}`}>*/}
            {/*                                                <NewsCard*/}
            {/*                                                    title={newsItem.title}*/}
            {/*                                                    date={newsItem.publishDate}*/}
            {/*                                                    image={newsItem.imagePreviewResized}*/}
            {/*                                                    newsBack={false}*/}
            {/*                                                />*/}
            {/*                                            </Link>*/}
            {/*                                        </SwiperSlide>*/}
            {/*                                    );*/}
            {/*                                } else {*/}
            {/*                                    // Здесь newsItem обрабатывается как NewsBack*/}
            {/*                                    return (*/}
            {/*                                        <SwiperSlide key={newsItem.id}>*/}
            {/*                                            <Link key={newsItem.id} to={`/news/${newsItem.id}`}>*/}
            {/*                                                <NewsCard*/}
            {/*                                                    date={newsItem.date}*/}
            {/*                                                    image={newsItem.images[0]}*/}
            {/*                                                    title={newsItem.title}*/}
            {/*                                                    newsBack={true}*/}
            {/*                                                />*/}
            {/*                                            </Link>*/}
            {/*                                        </SwiperSlide>*/}
            {/*                                    );*/}
            {/*                                }*/}
            {/*                            })}*/}
            {/*                        </Swiper>*/}
            {/*                        <div className={styles.moreNews__controls}>*/}
            {/*                            <button className={`button button--black button--prev ${styles.moreNews__more}`} type="button">*/}
            {/*                                <span>Предыдущие</span>*/}
            {/*                                <img src={buttonArrow} alt="" />*/}
            {/*                            </button>*/}
            {/*                            <button className={`button button--black button--next ${styles.moreNews__more}`} type="button">*/}
            {/*                                <span>Показать ещё</span>*/}
            {/*                                <img src={buttonArrow} alt="" />*/}
            {/*                            </button>*/}
            {/*                        </div>*/}
            {/*                    </>*/}
            {/*                ) : null*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>
    );
};

export default SingleNewsPageApi;