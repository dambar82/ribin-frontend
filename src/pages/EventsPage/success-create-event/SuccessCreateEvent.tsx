import { Button, Modal } from "../../../shared/UI"

import c from './successCreateEvent.module.scss'

//@ts-ignore
import image from '../../../images/ruby-create-event.png'

interface SuccessCreateEventProps {
  active: boolean | null
  setActive: React.Dispatch<React.SetStateAction<boolean | null>>
  setActiveTab: React.Dispatch<React.SetStateAction<number>>
}
const SuccessCreateEvent = ({ active, setActive, setActiveTab }: SuccessCreateEventProps) => {

  const exit = () => {
    setActive(false)
    setTimeout(() => {
      setActiveTab(0)
    }, 100);
  }

  const createNewEvent = () => {
    setActiveTab(1)
    setActive(false)
  }

  return (
    <Modal
      active={active}
      setActive={setActive}
      bodyClassName={c.modal_body_wrapper}
    >
      <div className={c.modal_body} >
        
        <div>
          <b>Мероприятие успешно создано!</b>
          <p>Ваше мероприятие было успешно создано и добавлено в календарь клуба. Теперь участники могут видеть его и присоединяться. Поделитесь информацией о вашем мероприятии с друзьями и коллегами, чтобы привлечь больше участников. Спасибо за вашу активность и вклад в жизнь клуба "Рубин"!</p>
          <div className={c.btns} >
            <Button onClick={exit} >Вернуться к списку мероприятий</Button>
            <Button onClick={createNewEvent} >Создать другое мероприятие</Button>
          </div>
        </div>

        <div>
          <img src={image} />
        </div>

      </div>
    </Modal>
  )
}

export { SuccessCreateEvent }