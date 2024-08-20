
export const isFileSizeAllowed = ( size: number ) => {
  
  if ( size / 1024 / 1024 >= 10 ) {

		alert('Файл дожен быть меньше 10 MB')

		return false
	}

	return true
}