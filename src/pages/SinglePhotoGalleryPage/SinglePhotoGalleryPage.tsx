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

    const gallery = useSelector((state: RootState) => state.photoGallery.photoGalleryData)

    const [activeModal, setActiveModal] = useState(false)
    const [activePhoto, setActivePhoto] = useState(0)

    const dispatch = useDispatch<AppDispatch>()

    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        dispatch(fetchPhotoGalleryById(id));
    }, [dispatch]);

    const openModalHandler = ( photoId: number ) => {
        setActiveModal(true)
        setActivePhoto(photoId)
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
                    {gallery?.photos?.map(photo => (
                        <div key={photo.id} className={styles.photoGallery__photoCard} onClick={() => openModalHandler(photo.id)} >
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
                  <div className={styles.photogallery_slide} >
                    <img src={gallery?.photos?.find(el => el.id === activePhoto).imagePreview} alt="#" />
                  </div>
                </Modal>
            </div>
        </div>
    )
}

export default SinglePhotoGalleryPage
