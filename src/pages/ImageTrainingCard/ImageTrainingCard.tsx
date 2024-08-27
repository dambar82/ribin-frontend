
import { classNames } from '../../shared/utils'
import c from './ImageTrainingCard.module.scss'

interface ImageTrainingCardProps {
  title: string
  image: string
  description?: string
  className?: string
  onClick?: () => void
}
const ImageTrainingCard = ({ title, image, description, className, onClick }: ImageTrainingCardProps) => {
  return (
    <div className={classNames(c.image_wrapper, className)} onClick={onClick} >
      <img src={image} alt="#" />
      <p>{title}</p>
    </div>
  )
}

export { ImageTrainingCard }