import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import styles from './GalleryCard.module.scss';
import photoIcon from '../../images/svg/photo.svg'

import { fetchPhotoGalleryById } from '../../store/photoGallerySlice';

interface IPhotoGalleryCard {
    id: number;
    name: string;
    image: string;
    category: string;
    date: string;
}

const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split(" ")[0].split(".")
    const months = {
        "01": "января",
        "02": "февраля",
        "03": "марта",
        "04": "апреля",
        "05": "мая",
        "06": "июня",
        "07": "июля",
        "08": "августа",
        "09": "сентября",
        "10": "октября",
        "11": "ноября",
        "12": "декабря"
    };
    return [day, months[month], year]
}

const GalleryCard = ({ id, name, image, category, date }: IPhotoGalleryCard) => {
    const dispatch = useDispatch<AppDispatch>()
    const { photoGallery } = useSelector((state: RootState) => state.photoGallery);
    let formatedDate = formatDate(date)

    useEffect(() => {
        dispatch(fetchPhotoGalleryById(id));
    }, []);

    return (
        <div className={styles.card}>
            <div className={styles.card__date}>{formatedDate[0]} <span>{formatedDate[1]}</span> {formatedDate[2]}</div>
            <div className={styles.card__image}>
                { image && <img src={image} alt=''/>}
            </div>
            <div className={styles.card__content}>
                <div className={styles.card__amount}>
                    <div className={styles.card__amountIcon}>
                        <img src={photoIcon} />
                    </div>
                    <div className={styles.card__amountLabel}>
                        <span>{0}</span> фотографий
                    </div>
                </div>
                <h3 className={styles.card__title}>{ name }</h3>
                <p className={styles.card__category}>{ category }</p>
            </div>
        </div>
    )
}

export default GalleryCard