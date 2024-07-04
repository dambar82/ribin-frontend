import React, { useState, useEffect} from 'react';
import styles from './NewsPage.module.scss';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchContests} from "../../store/contestSlice";

import Grid from '../../components/Grid/Grid';
import NewsCard from '../../components/NewsCard/NewsCard';

import buttonArrow from "../../images/svg/button_arrow.svg";
import {News} from "../../types";
import {fetchNews} from "../../store/newsSlice";

const NewsPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const maxButtons = 6;
    const { status, news } = useSelector((state: RootState) => state.news);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNews());
        }
    }, [status, dispatch]);


    return (
        <div className="page">
            <div className={`${styles.hero} hero`}>
                <img src="images/hero-news-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-news-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Новости</h1>
            </div>
            <div className='section'>
                <div className='section__header'>
                    <div className='section__title'>Все новости</div>
                    <div className='section__counter'>2303</div>
                </div>
                <div className='section__body'>
                    <Grid>
                        {news.map((newsItem) => (
                            <Link to={newsItem.url}>
                                <NewsCard
                                    key={newsItem.id}
                                    title={newsItem.title}
                                    date={newsItem.publishDate}
                                    image={newsItem.imagePreviewResized}
                                />
                            </Link>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
