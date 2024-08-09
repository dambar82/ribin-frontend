import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import styles from './SportPage.module.scss';

import Grid from '../../components/Grid/Grid';
import VideoTrainingCard from '../../components/VideoTrainingCard/VideoTrainingCard';

import { fetchSport } from '../../store/sportSlice';
import { arrayFromTo } from '../../shared/utils'
import { Sport } from '../../types'
import { ImageTrainingCard } from '../ImageTrainingCard/ImageTrainingCard'

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
    
    const healthyEatingElems = () => {
      const chunkSize = 3

      const healthy_eating_video: Sport['healthy_eating_video'][] = []
      const healthy_eating_images: Sport['healthy_eating_img'][] = []

      for (let i = 0; i < sports.healthy_eating_video.length; i += chunkSize) {
          healthy_eating_video.push(sports.healthy_eating_video.slice(i, i + chunkSize))
      }

      for (let i = 0; i < sports.healthy_eating_img.length; i += chunkSize) {
        healthy_eating_images.push(sports.healthy_eating_img.slice(i, i + chunkSize))
      }

      const length = Math.max(healthy_eating_video.length, healthy_eating_images.length) * 2 - 1

      let indexVideo = 0
      let indexImage = 0

      const result = arrayFromTo(0, length).map(num => {
        if ( num % 2 ) {
          const r = healthy_eating_images[indexImage]
          indexImage++
          return r
        }

        const r = healthy_eating_video[indexVideo]
        indexVideo++
        return r
      })
      
      return result.reduce((acc, arr) => {
        arr?.forEach(el => acc.push(el))
        return acc
      }, [])
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

                        {tabPage === 0 && 
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

                        {tabPage === 1 && 
                          <div className='tab-page'>
                            <Grid totalItems={sports["healthy_eating_video"]?.length}>
                              {healthyEatingElems().map(elem => {
                                if ( elem.source.includes('.mp4') ) {
                                  return (
                                    <VideoTrainingCard 
                                      key={elem.id}
                                      title={elem.name}
                                      description={elem.description}
                                      image={elem.source}
                                    />
                                  )
                                }
                                return (
                                  <ImageTrainingCard 
                                    key={elem.id}
                                    title={elem.name}
                                    description={elem.description}
                                    image={elem.source}
                                  />
                                )
                              })}
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