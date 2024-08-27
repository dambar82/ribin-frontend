import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import styles from './SportPage.module.scss';

import Grid from '../../components/Grid/Grid';
import VideoTrainingCard from '../../components/VideoTrainingCard/VideoTrainingCard';

import { fetchSport } from '../../store/sportSlice';
import { arrayFromTo, classNames } from '../../shared/utils'
import { Sport } from '../../types'
import { ImageTrainingCard } from '../ImageTrainingCard/ImageTrainingCard'
import { Modal } from '../../shared/UI'

const SportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [tabPage, setTabPage] = useState(0)

    const { sports, status, error } = useSelector((state: RootState) => state.sport);

    const [activePhotoModal, setActivePhotoModal] = useState(false)
    const [activePhoto, setActivePhoto] = useState(0)
    const [activeVideoModal, setActiveVideoModal] = useState(false)
    const [activeVideo, setActiveVideo] = useState(0)

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

    const openPhotoModalHandler = ( index: number ) => {
      setActivePhoto(index)
      setTimeout(() => {
        setActivePhotoModal(true)
      }, 100)
    }

    const openVideoModalHandler = ( index: number ) => {
      setActiveVideo(index)
      setTimeout(() => {
        setActiveVideoModal(true)
      }, 100)
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
                    <div className='section__counter'>
                      {tabPage === 0 && sports.training_videos?.length}
                      {tabPage === 1 && sports.healthy_eating_video?.length + sports.healthy_eating_img?.length}
                    </div>
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
                                  {sports["training_videos"]?.map((video, index) => (<>
                                      <VideoTrainingCard 
                                          key={video.id}
                                          title={video.name}
                                          description={video.description}
                                          image={video.source}
                                          thumbnail={video.thumbnail}
                                          onClick={() => openVideoModalHandler(index)}
                                      />
                                  </>))}
                              </Grid>
                              <Modal
                                active={activeVideoModal}
                                setActive={setActiveVideoModal}
                                className={styles.training_videos_modal}
                                bodyClassName={styles.training_videos_modal_body}
                              >
                                <div>
                                  <VideoTrainingCard 
                                    key={sports["training_videos"]?.find((_, i) => i === activeVideo)?.id}
                                    image={sports["training_videos"]?.find((_, i) => i === activeVideo)?.source}
                                  />
                                </div>
                              </Modal>
                          </div>
                        }

                        {tabPage === 1 && 
                          <div className='tab-page'>
                            <Grid totalItems={sports["healthy_eating_video"]?.length}>
                              {healthyEatingElems().map((elem, index) => {
                                if ( elem.source.includes('.mp4') ) {
                                  return (
                                    <VideoTrainingCard 
                                      key={elem.id}
                                      title={elem.name}
                                      description={elem.description}
                                      image={elem.source}
                                      onClick={() => openVideoModalHandler(index)}
                                    />
                                  )
                                }
                                return (
                                  <ImageTrainingCard 
                                    key={elem.id}
                                    title={elem.name}
                                    image={elem.source}
                                    className={styles.image_card}
                                    onClick={() => openPhotoModalHandler(index)}
                                  />
                                )
                              })}
                            </Grid>
                            <Modal
                              active={activePhotoModal}
                              setActive={setActivePhotoModal}
                              className={styles.training_videos_modal}
                              bodyClassName={classNames(styles.training_videos_modal_body, styles.image_modal_body)}
                            >
                              {(() => {
                                const data = sports['healthy_eating_img']?.find((_, i) => i === activePhoto)
                                return (
                                  <div className={styles.image_body} >
                                    <img src={data?.source} alt="#" />
                                    <b>{data?.name}</b>
                                    <p>{data?.description}</p>
                                  </div>
                                )
                              })()}
                            </Modal>
                            <Modal
                                active={activeVideoModal}
                                setActive={setActiveVideoModal}
                                className={styles.training_videos_modal}
                                bodyClassName={styles.training_videos_modal_body}
                              >
                                <div>
                                  <VideoTrainingCard 
                                    key={sports['healthy_eating_video']?.find((_, i) => i === activeVideo)?.id}
                                    image={sports["healthy_eating_video"]?.find((_, i) => i === activeVideo)?.source}
                                  />
                                </div>
                              </Modal>
                          </div>
                        }
                    </div>    
                </div>
            </div>
        </div>
    );
};

export default SportPage;