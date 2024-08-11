import { useMemo } from "react"
import { PhotoGallery } from "../../../types"
import { TFilters } from "../PhotoGalleryPage"

export const useFilterPhotoGallery = (
  photoGallery: PhotoGallery[],
  filters: TFilters | null,
  album: string
): {
  filtredPhotoGallery: PhotoGallery[]
  albums: string[]
} => {

  return useMemo(() => {

    const albums = []

    photoGallery.forEach(gallery => {
      if (!albums.includes(gallery.sectionName)) {
        albums.push(gallery.sectionName)
      }
    })

    let filtredPhotoGallery: PhotoGallery[] = []

    if ( album !== "Все альбомы" ) {
      filtredPhotoGallery = photoGallery.filter(gallery => gallery.sectionName === album)
    } else {
      filtredPhotoGallery = structuredClone(photoGallery)
    }

    Object.keys(filters || {}).forEach(key => {
      const filter = filters[key]

      if ( filter.key === 'all' ) return

      switch (key) {
        case 'teams':
          filtredPhotoGallery = filtredPhotoGallery.filter(gallery => {
            return gallery.title.toLocaleLowerCase().includes(filter.value.toLocaleLowerCase())
          })
          break;
        case 'month':
          filtredPhotoGallery = filtredPhotoGallery.filter(gallery => {
            return gallery.publishDate.substring(3,5) === filter.key.toString().padStart(2, '0')
          })
          break;
        case 'year':
          filtredPhotoGallery = filtredPhotoGallery.filter(gallery => {
            return gallery.publishDate.substring(6,10) === filter.key.toString()
          })
          break;
      }
    })

    return {
      filtredPhotoGallery,
      albums
    }

  }, [photoGallery, filters, album])

}