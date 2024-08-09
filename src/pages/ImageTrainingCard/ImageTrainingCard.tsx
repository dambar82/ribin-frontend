
import c from './ImageTrainingCard.module.scss'

interface ImageTrainingCardProps {
  title: string
  image: string
  description: string
}
const ImageTrainingCard = ({ title, image, description }: ImageTrainingCardProps) => {
  return (
    <div className={c.image_wrapper} >
      <img src={image} alt="#" />
      <p>{description}</p>
    </div>
  )
}

export { ImageTrainingCard }