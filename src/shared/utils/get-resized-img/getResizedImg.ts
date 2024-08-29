
interface TGetCroppedImgArgs {
	img: HTMLImageElement
	newWidth: number
	newHeight: number
	imgWidth: number
	imgHeight: number
}

export const getResizedImg = ({ img, newWidth, newHeight, imgWidth, imgHeight }: TGetCroppedImgArgs): Promise<Blob> => {

	return new Promise(resolve => {

		const canvas: HTMLCanvasElement = document.createElement('canvas')
		const ctx = canvas.getContext('2d')!

		canvas.width = newWidth
		canvas.height = newHeight

    console.log(newWidth, newHeight);
    
		if ( imgWidth > imgHeight ) {
      if ( newWidth === newHeight ) {
        const x = Math.ceil( (imgWidth - imgHeight) / 2 )
        ctx.drawImage(img, x, 0, imgHeight, imgHeight, 0, 0, newWidth, newHeight)
      }
      else if ( imgWidth < newWidth ) {
        const scaleFactor = newWidth / imgWidth;
        const h = imgHeight * scaleFactor
        const y = -1 * Math.ceil( (imgHeight - newHeight) / 2 )
        console.log(newWidth);
        
        ctx.drawImage(img, 0, y, newWidth, h)
      }
      else {
        const scaleFactor = newWidth / imgWidth;
        const h = imgHeight * scaleFactor
        const y = -1 * Math.ceil( (h - newHeight) / 2 )
        console.log(newWidth);
        
        ctx.drawImage(img, 0, y, newWidth, h)
      }
		}

		if (imgWidth < imgHeight) {
			const y = Math.ceil( (imgHeight - imgWidth) / 2 )
			ctx.drawImage(img, 0, y, newWidth, newHeight, 0, 0, newWidth, newHeight)
		}

		if (imgWidth == imgHeight) {
			ctx.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, newWidth, newHeight)
		}

		canvas.toBlob((blob: any) => resolve(blob), "image/png")

	})
	
}