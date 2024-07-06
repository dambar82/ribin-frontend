import { useState } from 'react'
import styles from './SportPage.module.scss';


import Grid from '../../components/Grid/Grid';
import VideoTrainingCard from '../../components/VideoTrainingCard/VideoTrainingCard';

const SportPage = () => {
    const [tabPage, setTabPage] = useState(0)

    const trainingPrograms = [
        { title: "Основы футбольной тренировки", desc: "Узнайте основные упражнения и техники, которые помогут вам стать лучше на футбольном поле.", imgSrc: "training-image-1.png" },
        { title: "Разминка перед тренировкой", desc: "Важные упражнения для правильной разминки перед тренировкой или игрой.", imgSrc: "training-image-2.png" },
        { title: "Кардиотренировка для школьников", desc: "Увлекательная кардиотренировка, которая поможет улучшить выносливость и здоровье сердца.", imgSrc: "training-image-3.png" }
    ]

    // const changeTabPage = (page: number) => {
    //     setTabPage(currentPage=> {
    //         if (currentPage !== page)
    //             return page
    //     })
    // }

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
                    <div className='section__title'>Видео-тренировки</div>
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
                                <Grid totalItems={trainingPrograms.length}>
                                    { trainingPrograms.map(({title, desc, imgSrc }, index) => (
                                        <VideoTrainingCard key={title + index} title={title} short_description={desc} image={imgSrc} />
                                    ))}
                                    { trainingPrograms.map(({title, desc, imgSrc }, index) => (
                                        <VideoTrainingCard key={title + index} title={title} short_description={desc} image={imgSrc} />
                                    ))}
                                </Grid>          
                            </div>
                        }
                        {
                            tabPage === 1 && 
                            <div className='tab-page'>
                                <Grid totalItems={trainingPrograms.length}>
                                    { trainingPrograms.map(({title, desc, imgSrc }, index) => (
                                        <VideoTrainingCard key={title + index} title={title} short_description={desc} image={imgSrc} />
                                    ))}
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