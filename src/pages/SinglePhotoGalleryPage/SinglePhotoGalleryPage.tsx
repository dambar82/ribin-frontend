import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { Modal } from '../../shared/UI'
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination } from 'swiper/modules'
import { fetchPhotoGalleryById } from '../../store/photoGallerySlice';

import styles from "./SinglePhotoGalleryPage..module.scss"
import "swiper/css";
import 'swiper/css/effect-fade';
import "swiper/css/navigation";
import 'swiper/css/pagination';

import photoIcon from '../../images/svg/photo.svg'


const SinglePhotoGalleryPage = () => {

    const { id } = useParams()

    const gallery = useSelector((state: RootState) => state.photoGallery.photoGallery.find(gallery => gallery.id === parseInt(id)))
    
  //////////////////////////////__dev__////////////////////////////////////
  const photos = useMemo(() => {
    return structuredClone(gallery?.photos || []).map(el => {
      el.id = getRandom()
      return el
    })
  }, [])

  function getRandom() {
    return Date.now() + Math.round(Math.random()*10000)
  }
  //////////////////////////////__dev__////////////////////////////////////

    const [activeModal, setActiveModal] = useState(false)
    const [initialSlide, setInitialSlide] = useState(1)
    
    const dispatch = useDispatch<AppDispatch>()
      
    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        dispatch(fetchPhotoGalleryById(id));
    }, [dispatch]);

    const openModalHandler = ( photoId: number ) => {
      setActiveModal(true)
      const index = photos.findIndex(el => el.id === photoId)
      setInitialSlide(index)
    }

    return (
        <div className="page">
            <div className={styles.photoGallery}>
                <div className={styles.photoGallery__header}>
                    <h1 className={styles.photoGallery__title}>{ gallery?.title }</h1>
                    <div className={styles.photoGallery__info}>
                        <div className={styles.photoGallery__date}>{ gallery?.publishDate }</div>
                        <div className={styles.photoGallery__tag}>#{gallery?.sectionName}</div>
                        <div className={styles.photoGallery__qty}>
                            <img src={photoIcon} alt="" />
                            <span>{gallery?.photos ? gallery?.photos.length : 0} фотографий</span>
                        </div>
                    </div>
                </div>
                <div className={styles.photoGallery__grid}>
                    { gallery?.photos
                        ? (
                           photos.map(photo => (
                                <div key={photo.id} className={styles.photoGallery__photoCard} onClick={() => openModalHandler(photo.id)} >
                                    <img src= {photo.imagePreview} alt="" />
                                </div>
                           ))
                        ) : <p>Loading.....</p>
                    }
                </div>
                <Modal
                  active={activeModal}
                  setActive={setActiveModal}
                  className={styles.photogallery_modal}
                  bodyClassName={styles.photogallery_modal_body}
                >
                  <Swiper
                    ref={swiperRef}
                    navigation={true}
                    pagination={{ type: 'fraction' }}
                    effect={'fade'}
                    slidesPerView={1}
                    initialSlide={initialSlide}
                    loop={true}
                    modules={[EffectFade, Pagination, Navigation]}
                    className={styles.photogallery_swiper}
                  >
                    {photos?.map(photo => (
                      <SwiperSlide key={photo.id} className={styles.photogallery_slide} >
                        <img src={photo.imagePreview} alt="#" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div
                    className="swiper-button-prev"
                    onClick={() => swiperRef.current?.swiper?.slidePrev()}
                  ></div>
                  <div
                    className="swiper-button-next"
                    onClick={() => swiperRef.current?.swiper?.slideNext()}
                  ></div>
                </Modal>
            </div>
        </div>
    )
}

export default SinglePhotoGalleryPage