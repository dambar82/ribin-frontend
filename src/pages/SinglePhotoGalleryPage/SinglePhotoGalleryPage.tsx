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
import axios from "axios";


const SinglePhotoGalleryPage = () => {

    const { id } = useParams()

    const gallery = useSelector((state: RootState) => state.photoGallery.photoGalleryData)
    const [ourGallery, setOurGallery] = useState([]);
    const [activeModal, setActiveModal] = useState(false)
    const [activePhoto, setActivePhoto] = useState(0)

    const dispatch = useDispatch<AppDispatch>()

    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        dispatch(fetchPhotoGalleryById(id));
        if (id === '0') {
            const fetchOurGallery = async () => {
                const response = await axios.get('https://api-rubin.multfilm.tatar/api/photo_gallery');
                console.log(response.data)
                setOurGallery(response.data)
            }
            fetchOurGallery();
        }
    }, [dispatch]);

    const openModalHandler = ( index: number ) => {
      setActivePhoto(index)
      setTimeout(() => {
        setActiveModal(true)
      }, 100)
    }

    return (
        <div className="page">
            <div className={styles.photoGallery}>
                {id !== '0' ? (
                    <>
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
                            {gallery?.photos?.map((photo, index) => (
                                <div
                                    key={index}
                                    className={styles.photoGallery__photoCard}
                                    onClick={() => openModalHandler(index)}
                                >
                                    <img src= {photo.imagePreviewResized} alt="" />
                                </div>
                            ))}
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
                                initialSlide={activePhoto}
                                loop={true}
                                modules={[EffectFade, Pagination, Navigation]}
                                className={styles.photogallery_swiper}
                            >
                                {gallery?.photos?.map(photo => (
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
                    </>
                ) : (
                    <>
                        <div className={styles.photoGallery__header}>
                            <h1 className={styles.photoGallery__title}>Наша галерея</h1>
                            <div className={styles.photoGallery__info}>
                                <div className={styles.photoGallery__date}>19.09.2024 11:20:32</div>
                                <div className={styles.photoGallery__tag}>#Клуб</div>
                                <div className={styles.photoGallery__qty}>
                                    <img src={photoIcon} alt="" />
                                    <span>{ourGallery.length} фотографий</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.photoGallery__grid}>
                            {ourGallery.map((photo, index) => (
                                <div
                                    key={index}
                                    className={styles.photoGallery__photoCard}
                                    onClick={() => openModalHandler(index)}
                                >
                                    <img src= {photo} alt="" />
                                </div>
                            ))}
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
                                initialSlide={activePhoto}
                                loop={true}
                                modules={[EffectFade, Pagination, Navigation]}
                                className={styles.photogallery_swiper}
                            >
                                {ourGallery.map(photo => (
                                    <SwiperSlide key={photo.id} className={styles.photogallery_slide} >
                                        <img src={photo} alt="#" />
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
                    </>
                )}
            </div>
        </div>
    )
}

export default SinglePhotoGalleryPage
