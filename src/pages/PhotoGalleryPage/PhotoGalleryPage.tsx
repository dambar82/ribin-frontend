import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchPhotoGallery, setStatus } from '../../store/photoGallerySlice';
import GalleryCard from '../../components/GalleryCard/GalleryCard';
import { Filter } from './components'

import styles from "./PhotoGalleryPage.module.scss";
import { useFilterPhotoGallery } from './hooks/useFilterPhotoGallery'
import { FILTERS } from './constants'
import axios from "axios";


export type TFilters = {
  [id: string]: { key: number | string, value: string }
}


const PhotoGalleryPage = () => {

  const { photoGallery, status, error } = useSelector((state: RootState) => state.photoGallery);
  const [ourGallery, setOurGallery] = useState([]);
  const [album, setAlbum] = useState("Все альбомы")
  const [filters, setFilters] = useState<TFilters>(FILTERS.reduce<TFilters>((acc, elem) => {
    acc[elem.id] = elem.elements[0]
    return acc
  }, {}))
  
  const dispatch = useDispatch<AppDispatch>()

  const { filtredPhotoGallery, albums } = useFilterPhotoGallery(photoGallery, filters, album)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPhotoGallery());
      const fetchOurGallery = async () => {
          const response = await axios.get('https://api-rubin.multfilm.tatar/api/photo_gallery');
          console.log(response.data)
          setOurGallery(response.data)
      }
      fetchOurGallery();
    }
  }, [status, dispatch]);

useEffect(() => {
    console.log(ourGallery)
}, [ourGallery])

  useEffect(() => {
    return () => {
      dispatch(setStatus('idle'))
    }
  }, []);

  if (status === 'loading') {
      return <p>Loading...</p>;
  }

  if (status === 'failed') {
      return <p>{error}</p>;
  }

    return (
        <div className="page">
            <section className={`section ${styles.photogallery}`}>
                <div className="section__header">
                    <h1 className="section__title">Фотогалерея</h1>
                </div>
                <div className="section__body">

                  <nav className='tab-nav'>
                      {albums.length && (
                        ["Все альбомы", ...albums].map(item => (
                            <button
                              key={item}
                              className={`button button--white tab-button ${item === album ? "tab-button--active" : ""}`}
                              type='button'
                              onClick={() => setAlbum(item)}
                            >
                              <span>{item}</span>
                            </button>
                        ))
                      )}
                      <Filter filters={filters} setFilters={setFilters} />
                  </nav>

                  <div className={styles.photogallery__grid}>
                      <Link to={`/photogallery/0`}>
                          <GalleryCard
                              id={0}
                              name={'РУБИН. 80 гимназия'}
                              category={'Клуб'}
                              image={ourGallery[0]}
                              date={'19.09.2024 11:20:32'}
                          />
                      </Link>
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