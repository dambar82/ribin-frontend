import { useState } from 'react';
import clubsImg from "../../images/svg/clubsImg.svg";
import buttonArrow from "../../images/svg/button_arrow.svg";
import articleBg from '../../images/article-bg.svg';

// @ts-ignore
import Grid from '../../components/Grid/Grid'
// @ts-ignore
import ClubCard from '../../components/ClubCard/ClubCard';

import styles from './Clubs.module.scss';

const Clubs = () => {
    const [currentPage, setCurrentPage] = useState(0)
    const totalPage = 10

    const changeToPrevPage = () => {
        setCurrentPage(prevPage => {
            if (prevPage === 6) {
                return prevPage - 2
            }
            return prevPage - 1
        })
    }

    const changeToNextPage = () => {
        setCurrentPage(prevPage => {
            if (prevPage === 4) {
                return prevPage + 2
            }
            return prevPage + 1
        })
    }
    return (
        <div className='page'>
            <div className='image'>
                <img src={clubsImg} alt=""/>
            </div>
            <div className={`section ${styles.clubs}`}>
                <div className='section__header'>
                    <h2 className='section__title'>Лучшие клубы</h2>
                </div>
                <div className='section__body'>
                    <div className={styles.clubs__row}>
                        {[1, 2, 3].map((item) => {
                            return <ClubCard key={item}/>
                        })}
                    </div>
                </div>
            </div>
            <article className={styles.article}>
                {/*<img src={articleBg} alt="" />*/}
                <div className={styles.article__content}>
                    <h3 className={styles.article__slogan}>Создай клуб своей мечты! Преврати свои идеи в реальность и объединяй людей с такими же интересами.</h3>
                    <button className={`${styles.article__button} button button--white`} type='button'>
                        <span>Создать свой клуб</span>
                    </button>
                </div>
            </article>
            <div className={`section ${styles.clubs}`}>
                <div className='section__header'>
                    <h2 className='section__title'>Все клубы</h2>
                    <div className='section__counter'>2303</div>
                </div>
                <div className='section__body'>
                    {/*<Grid card={<ClubCard />} />*/}
                    {/* <div className='clubs__grid gird'>
                        <div className='grid__list'>
                            {[1, 2, 3, 4, 5, 6].map((item) => {
                                return <ClubCard key={item}/>
                            })}
                        </div>
                        <div className="grid__controls">
                            <nav className="grid__pagination pagination">
                                <ul className="pagination__list">
                                    {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                                        if (item < 6)
                                            return (
                                                <li key={item + index} className="pagination__item">
                                                    <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} onClick={() => setCurrentPage(index)} type="button"><span>{item}</span></button>
                                                </li>
                                            )
                                        if (item === 6) {
                                            return (
                                                <li key={item + index} className="pagination__item">
                                                    <button className="pagination__button pagination__button--ellipsis" type="button"><span>...</span></button>
                                                </li>
                                            )
                                        }
                                        return (
                                            <li key={item + index} className="pagination__item">
                                                <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button" onClick={() => setCurrentPage(index)}><span>10</span></button>
                                            </li>
                                        )

                                    })}
                                </ul>
                            </nav>
                            <div className='grid__buttons'>
                                { currentPage !== 0 && (
                                    <button className='grid__button grid__button--prev button button--black' type='button' onClick={changeToPrevPage}>
                                        <img src={buttonArrow} alt="" />
                                        <span>Предыдущие</span>
                                    </button>
                                )}
                                { currentPage !== totalPage - 4 && (
                                    <button className='grid__button grid__button--next button button--black' type='button' onClick={changeToNextPage}>
                                        <span>Показать ещё</span>
                                        <img src={buttonArrow} alt="" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Clubs;
