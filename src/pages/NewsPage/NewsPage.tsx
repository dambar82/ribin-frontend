import React, { useState, useEffect} from 'react';
import styles from './NewsPage.module.scss';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchContests} from "../../store/contestSlice";

import Grid from '../../components/Grid/Grid';
import NewsCard from '../../components/NewsCard/NewsCard';

import {News} from "../../types";
import {fetchNewsAndNewsBack} from "../../store/newsSlice";

function normalizeDate(dateStr) {
    if (dateStr.includes('.')) {
        // Если дата в формате "23.08.2024 21:59:43"
        const [day, month, yearTime] = dateStr.split('.');
        const [year, time] = yearTime.split(' ');
        return new Date(`${year}-${month}-${day}T${time || '00:00:00'}`);
    } else {
        // Если дата в формате "2024-03-12"
        return new Date(dateStr);
    }
}

const NewsPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { status, news } = useSelector((state: RootState) => state.news);

    useEffect(() => {
        dispatch(fetchNewsAndNewsBack());
    }, [dispatch]);

    // @ts-ignore
    const hasVisibleFixedNews = news.some(item => item.is_visible === 1 && item.fixed === 1);

    const sortedNews = news
        // @ts-ignore
        .filter((item) => item.fixed === 0)
        // @ts-ignore
        .filter((item) => item.is_visible === 1)
        .slice().sort((a, b) => {
        // @ts-ignore
        const dateA = a.createdAt ? normalizeDate(a.createdAt) : normalizeDate(a.date);
        // @ts-ignore
        const dateB = b.createdAt ? normalizeDate(b.createdAt) : normalizeDate(b.date);
        // @ts-ignore
        return dateB - dateA;
    });

    return (
        <div className="page">
            <div className={`${styles.hero} hero`}>
                <img src="images/hero-news-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-news-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Новости</h1>
            </div>
            {hasVisibleFixedNews && (
                <div className="section">
                    <div className="section__header">
                        <div className="section__title">Актуальное</div>
                    </div>
                    <div className={`${styles.actualNews}`}>
                        <Link to="/news/26">
                            <div className="news_actual">
                                <img src="images/actualNewsCard1.jpg" alt="" />
                                <div className='news_actual_text'>
                                    Игроки Рубина проводят уроки в школе. Узнай, как пригласить их в свою школу!
                                </div>
                            </div>
                        </Link>
                        <Link to="/news/35">
                            <div className="news_actual">
                                <img src="images/actualNewsCard2.jpg" alt="" />
                                {/*<div className='news_actual_text'>*/}
                                {/*    Пригласи МФЦ к себе в школу и оформи карту болельщика всем классом!*/}
                                {/*</div>*/}
                            </div>
                        </Link>
                    </div>
                </div>
            )}
            <div className='section'>
                <div className='section__header'>
                    <div className='section__title'>Все новости</div>
                    <div className='section__counter'>{news.length}</div>
                </div>
                <div className='section__body'>
                    <Grid totalItems={news.length} itemsPerPage={12} threeCols={true}>
                        {
                            sortedNews.map((newsItem) => {
                                if ('imagePreviewResized' in newsItem) {
                                    return (
                                        <Link key={newsItem.id} to={`/news/api/${newsItem.id}`}>
                                            <NewsCard
                                                title={newsItem.title}
                                                date={newsItem.publishDate}
                                                image={newsItem.imagePreviewResized}
                                                newsBack={false}
                                                isFixed={false}
                                            />
                                        </Link>
                                    );
                                } else {
                                    return (
                                        <Link key={newsItem.id} to={`/news/${newsItem.id}`}>
                                            <NewsCard
                                                date={newsItem.date}
                                                image={newsItem.images[0]}
                                                title={newsItem.title}
                                                key={newsItem.id}
                                                newsBack={true}
                                                isFixed={false}
                                            />
                                        </Link>
                                    );
                                }
                            })
                        }
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
