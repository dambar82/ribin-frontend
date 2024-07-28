import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';

import styles from "./PhotoGalleryPage.module.scss";

import GalleryCard from '../../components/GalleryCard/GalleryCard';

import filter from "../../images/svg/filter.svg"
import { fetchPhotoGallery } from '../../store/photoGallerySlice';

const PhotoGalleryPage = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [album, setAlbum] = useState("Все альбомы")
    const dispatch = useDispatch<AppDispatch>()
    const { photoGallery, status, error } = useSelector((state: RootState) => state.photoGallery);
    const albums= [];
    let filtredPhotoGallery = photoGallery

    useEffect(() => {

        if (status === 'idle') {
            dispatch(fetchPhotoGallery());
        }

    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    photoGallery.forEach(gallery => {
        if (!albums.includes(gallery.sectionName)) {
            albums.push(gallery.sectionName)
        }
    })

    if (album !== "Все альбомы") {
        filtredPhotoGallery = photoGallery.filter(gallery => gallery.sectionName === album)
    }
    return (
        <div className="page">
            <section className={`section ${styles.photogallery}`}>
                <div className="section__header">
                    <h1 className="section__title">Фотогалерея</h1>
                </div>
                <div className="section__body">
                        <nav className='tab-nav'>
                            {
                                albums.length && (
                                    ["Все альбомы", ...albums].map((item, index) => (
                                        <button key={item} className={`button button--white tab-button ${item === album ? "tab-button--active" : ""}`} type='button' onClick={() => setAlbum(item)}><span>{item}</span></button>
                                    ))
                                )
                            }
                            <div className={`${styles.photogallery__filter} ${dropdownOpen ? "filter filter--open" : "filter"}`} style={{ marginLeft: "auto" }}>
                                <button className='filter__button' type="button" onClick={() => setDropdownOpen(prevState => !prevState)}>
                                    <img src={filter} alt=''/>
                                </button>
                                <div className='filter__menu'>
                                    <ul className='filter__menu-list'>
                                        <li className='filter__menu-item'>
                                            <span>Все команды</span>
                                            <span className='filter__menu-arrow'>
                                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </li>
                                        <li className='filter__menu-item'>
                                            <span>Месяц</span>
                                            <span className='filter__menu-arrow'>
                                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </li>
                                        <li className='filter__menu-item'>
                                            <span>Год</span>
                                            <span className='filter__menu-arrow'>
                                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    <div className={styles.photogallery__grid}>
                        {filtredPhotoGallery.map(gallery => (
                            <Link to={`/photogallery/${gallery.id}`} key={gallery.id} >
                                <GalleryCard 
                                    id={gallery.id}
                                    name={gallery.title}
                                    category={gallery.sectionName}
                                    image={gallery.imagePreviewResized}
                                    date={gallery.publishDate}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PhotoGalleryPage