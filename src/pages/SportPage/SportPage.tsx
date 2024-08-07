import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import styles from './SportPage.module.scss';

import Grid from '../../components/Grid/Grid';
import VideoTrainingCard from '../../components/VideoTrainingCard/VideoTrainingCard';

import { fetchSport } from '../../store/sportSlice';

const SportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [tabPage, setTabPage] = useState(0)

    const { sports, status, error } = useSelector((state: RootState) => state.sport);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSport());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }
    
    return (
        <div className="page">
            <div className={`${styles.hero} hero`}>
                <img src="images/hero-sports-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-sports-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Спорт</h1>
                <p className={`${styles.hero__subtitle} hero__title`}>Для школьников</p>
            </div>
            <div className={`${styles.training} section`}>
                <div className='section__header'>
                    <div className='section__title'>{tabPage === 0 ? 'Видео-тренировки' : 'Здоровое питание'}</div>
                    <div className='section__counter'>2303</div>
                    <nav className='tab-nav' style={{ marginLeft: "auto" }}>
                        <button className={`button button--white tab-button ${tabPage === 0 ? "tab-button--active" : ""}`} type='button' onClick={() => setTabPage(0)}><span>Тренировки</span></button>
                        <button className={`button button--white tab-button ${tabPage === 1 ? "tab-button--active" : ""}`} type='button' onClick={() => setTabPage(1)}><span>Здоровое питание</span></button>
                    </nav>
                </div>
                <div className='section__body'> 
                    <div className='tab-content'>
                        {
                            tabPage === 0 && 
                            <div className='tab-page'>
                                <Grid totalItems={sports["training_videos"]?.length}>
                                    {sports["training_videos"]?.map(video => (
                                        <VideoTrainingCard 
                                            key={video.id}
                                            title={video.name}
                                            description={video.description}
                                            image={video.source}
                                        />
                                    ))}
                                </Grid>          
                            </div>
                        }
                        {
                            tabPage === 1 && 
                            <div className='tab-page'>
                                <Grid totalItems={sports["healthy_eating_video"]?.length}>
                                    {sports["healthy_eating_video"]?.map(video => (
                                        <VideoTrainingCard 
                                            key={video.id}
                                            title={video.name}
                                            description={video.description}
                                            image={video.source}
                                        />
                                    ))}
                                    {/* { trainingPrograms.map(({title, desc, imgSrc }, index) => (
                                        <VideoTrainingCard key={title + index} title={title} description={desc} image={imgSrc} />
                                    ))} */}
                                </Grid>          
                            </div>
                        }
                    </div>    
                </div>
            </div>
        </div>
    );
};

export default SportPage;