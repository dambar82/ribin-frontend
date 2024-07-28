import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';

import styles from "./SinglePhotoGalleryPage..module.scss"

import { fetchPhotoGalleryById } from '../../store/photoGallerySlice';

import photoIcon from '../../images/svg/photo.svg'

const SinglePhotoGalleryPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const gallery = useSelector((state: RootState) => state.photoGallery.photoGallery.find(gallery => gallery.id === parseInt(id)))

    useEffect(() => {
        dispatch(fetchPhotoGalleryById(id));
    }, [dispatch]);

    return (
        <div className="page">
            <div className={styles.photoGallery}>
                <div className={styles.photoGallery__header}>
                    <h1 className={styles.photoGallery__title}>{ gallery.title }</h1>
                    <div className={styles.photoGallery__info}>
                        <div className={styles.photoGallery__date}>{ gallery.publishDate }</div>
                        <div className={styles.photoGallery__tag}>#{gallery.sectionName}</div>
                        <div className={styles.photoGallery__qty}>
                            <img src={photoIcon} alt="" />
                            <span>{gallery.photos ? gallery.photos.length : 0} фотографий</span>
                        </div>
                    </div>
                </div>
                <div className={styles.photoGallery__grid}>
                    { gallery.photos
                        ? (
                           gallery.photos.map(photo => (
                                <div className={styles.photoGallery__photoCard}>
                                    <img src= {photo.imagePreview} alt="" />
                                </div>
                           ))
                        ) : <p>Loading.....</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default SinglePhotoGalleryPage