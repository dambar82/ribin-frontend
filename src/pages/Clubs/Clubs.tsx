import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { Link } from 'react-router-dom';

import styles from './Clubs.module.scss';

import Grid from '../../components/Grid/Grid'
import ClubCard from '../../components/ClubCard/ClubCard';

import { fetchClubs } from '../../store/clubsSlice';

const Clubs = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { clubs, status, error } = useSelector((state: RootState) => state.clubs);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchClubs());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className='page'>
            <div className={`${styles.hero} hero`}>
                <img src="images/hero-clubs-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-clubs-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Клубы</h1>
            </div>
            <div className={`section ${styles.clubs}`}>
                <div className='section__header'>
                    <h2 className='section__title'>Лучшие клубы</h2>
                </div>
                <div className='section__body'>
                    <div className={styles.clubs__row}>
                        {clubs.slice(0, 3).map((club, index) => (
                            <Link to={`/clubs/${index}`} key={club.name + index}>
                                <ClubCard
                                    name={club.name}
                                    image={club.caption}
                                    desc={club.short_description}
                                    participants={club.clients_count}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <article className={styles.article}>
                <img src="images/article-bg.png" alt="" />
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
                    <Grid totalItems={clubs.length}>
                        {clubs.map((club, index) => (
                            <ClubCard
                                key={club.name + index}
                                name={club.name}
                                image={club.caption}
                                desc={club.short_description}
                                participants={club.clients_count}
                            />
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default Clubs;