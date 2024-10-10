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
import {Box} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


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

  const { filtredPhotoGallery, albums } = useFilterPhotoGallery([...ourGallery,...photoGallery], filters, album)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPhotoGallery());
      const fetchOurGallery = async () => {
          const response = await axios.get('https://api-rubin.multfilm.tatar/api/all_galleries');
          console.log(response.data.data)
          setOurGallery(response.data.data)
      }
      fetchOurGallery();
    }
  }, [status, dispatch]);

useEffect(() => {
    console.log(photoGallery)
}, [photoGallery])

  useEffect(() => {
    return () => {
      dispatch(setStatus('idle'))
    }
  }, []);

  if (status === 'loading') {
      return (
          <Box
              sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80vh',
              }}
          >
              <CircularProgress
                  size="3rem"
                  sx={{ color: '#91172C' }}
              />
          </Box>
      )
  }

  if (status === 'failed') {
      return <p>{error}</p>;
  }

    // @ts-ignore
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
                      {
                          filtredPhotoGallery.map(gallery => {
                              if ('tags' in gallery) {
                                  return (
                                      <Link to={`/photogallery/${gallery.id}`} key={gallery.id} >
                                          <GalleryCard
                                              id={gallery.id}
                                              name={gallery.title}
                                              category={gallery.sectionName}
                                              image={gallery.imagePreviewResized}
                                              date={gallery.publishDate}
                                          />
                                      </Link>
                                      )
                              } else {
                                  return (
                                      //@ts-ignore
                                      <Link to={`/photogallery/${gallery.id}`} key={gallery.id}>
                                          <GalleryCard
                                              //@ts-ignore
                                              id={gallery.id}
                                              //@ts-ignore
                                              name={gallery.title}
                                              //@ts-ignore
                                              category={gallery.sectionName}
                                              //@ts-ignore
                                              image={gallery.album_cover}
                                              //@ts-ignore
                                              date={gallery.publishDate}
                                          />
                                      </Link>
                                  )
                              }
                        })
                      }
                  </div>

                </div>
            </section>
        </div>
    )
}



export default PhotoGalleryPage