
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

		const canvasContainer = document.querySelector('.user_img_wrapper')
		canvasContainer?.appendChild(canvas)

		if ( imgWidth > imgHeight ) {
      if ( newWidth === newHeight ) {
        const x = Math.ceil( (imgWidth - imgHeight) / 2 )
        ctx.drawImage(img, x, 0, imgHeight, imgHeight, 0, 0, newWidth, newHeight)
      }
      else if ( imgWidth < newWidth ) {
        const y = Math.ceil( (imgHeight - newHeight) / 2 )
        ctx.drawImage(img, 0, y, imgWidth, newHeight, 0, 0, newWidth, newHeight)
      }
      else {
        const y = Math.ceil( (imgHeight - newHeight) / 2 )
        ctx.drawImage(img, 0, y, imgWidth, newHeight, 0, 0, newWidth, newHeight)
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

		canvasContainer?.removeChild(canvas)

	})
	
}