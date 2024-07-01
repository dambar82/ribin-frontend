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
    const [newsFetched, setNewsFetched] = useState<News[]>([]);
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNews());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setNewsFetched(news);
    }, [news])

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
                    <Grid elements={newsFetched}/>
                    {/* <div className='grid'>
                        <div className='grid__list'>
                            {[1,2,3,4,5,6].map(() => {
                                return <NewsCard />
                            })}
                        </div>
                        <div className="grid__controls">
                            <nav className="grid__pagination pagination">
                                <ul className="pagination__list">
                                    {[1, 2, 3, 4, 5, 6, 7].map(( item, index, arr) => {
                                        if (arr.length <= 6) {
                                            return (
                                                <li key = { index } className="pagination__item">
                                                    <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button"><span>{item}</span></button>
                                                </li>
                                            )
                                        }

                                        if (currentPage < maxButtons - 3) {
                                            if (index < maxButtons - 1) {
                                                return (
                                                    <li key = { index } className="pagination__item">
                                                        <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button"><span>{item}</span></button>
                                                    </li>
                                                )
                                            } else if (index < maxButtons) {
                                                return (
                                                    <li key = { index } className="pagination__item">
                                                        <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button"><span>...</span></button>
                                                    </li>
                                                )
                                            } else if (index === arr.length - 1) {
                                                return (
                                                    <li key = { index } className="pagination__item">
                                                        <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button"><span>{item}</span></button>
                                                    </li>
                                                )
                                            }
                                        }
                                        return (
                                            <li key = { index } className="pagination__item">
                                                <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button"><span>{item}</span></button>
                                            </li>
                                        )
                                    })}

                                </ul>
                            </nav>
                            <div className='grid__buttons'>
                                <button className='grid__button grid__button--prev button button--black' type='button'>
                                    <img src={buttonArrow} alt="" />
                                    <span>Предыдущие</span>
                                </button>
                                <button className='grid__button grid__button--next button button--black' type='button'>
                                    <span>Показать ещё</span>
                                    <img src={buttonArrow} alt="" />
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
