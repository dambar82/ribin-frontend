import {useEffect, useState} from 'react'
import styles from './DropdownMenu.module.scss'
import {PostAnswer, sendCommentComplaint, sendPostComplaint} from "../../store/postSlice";
import { Button, Modal } from '../../shared/UI'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { classNames, getFormData } from '../../shared/utils'
import { Post } from '../../types'


interface IDropdownMenu {
    isAuthor: boolean;
    post?: {
      id: number
      created_by: number
      name: string
      surname: string
    }
    comment?: {
      id: number
      created_by: number
      name: string
    }
    deleteClick: () => void;
    editClick: () => void;
}
const DropdownMenu = ({isAuthor, post, comment, deleteClick, editClick}: IDropdownMenu) => {

    const [open, setOpen] = useState(false)
    
    const handleEditClick = () => {
      setOpen(false); // Закрываем меню
      editClick(); // Вызываем функцию редактирования
    }

    return (
        <div className={` ${styles.dropdown} ${open ? styles.dropdown_open : ''}`}>
        <button 
            className={styles.dropdown__button} 
            type="button"
            onClick={() => setOpen(prevState => !prevState)}
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
        <ul className={styles.dropdown__menu}>
            {
                isAuthor && (
                    <>
                        <li className={styles.dropdown__menuItem} onClick={handleEditClick}>Редактировать</li>
                        <li className={styles.dropdown__menuItem} onClick={deleteClick}>Удалить</li>
                    </>
                )
            }
            <li className={styles.dropdown__menuItem}>Открыть в новом окне</li>
            {
                !isAuthor && <ComplaintButton post={post} comment={comment} />
            }
        </ul>
    </div>
    )
}

interface ComplaintButtonProps {
  post?: {
    id: number
    name: string
    surname: string
  }
  comment?: {
    id: number
    name: string
  }
}
const ComplaintButton = ({ post, comment }: ComplaintButtonProps) => {

  const reasons = useAppSelector(state => state.post.complaint_types)
  const user = useAppSelector(state => state.user.user)

  const [activeModal, setActiveModal] = useState<boolean | null>(null)
  const [selectOpen, setSelectOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const [reason, setReason] = useState<{ text: string, id: number } | null>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    setReason(null)
    setSelectOpen(false)
  }, [activeModal])

  const chooseReason = ( resonTitle: string, reasonId: number ) => {
    setReason({ text: resonTitle, id: reasonId })
    setSelectOpen(false)
  }

  const onSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    const { description } = getFormData<{ description: string }>(e.currentTarget)

    if ( !reason ) {
      setErrorMessage('Выберите причину')
      return
    }

    if ( !description || description.length < 10 ) {
      setErrorMessage('Описание должно быть не менее 10 символов')
      return
    }

    setErrorMessage('')

    if ( post ) {
      dispatch(sendPostComplaint({
        id: post.id,
        complaint_type: reason.text,
        complaint_type_id: reason.id,
        description
      }))
      .then(() => {
        setSuccess(true)
      })
    }

    if ( comment ) {
      dispatch(sendCommentComplaint({
        id: comment.id,
        complaint_type: reason.text,
        complaint_type_id: reason.id,
        description
      }))
      .then(() => {
        setSuccess(true)
      })
    }

  }

  return (<>
    <li
      className={styles.dropdown__menuItem}
      onClick={() => setActiveModal(true)}
    >
      Пожаловаться
    </li>

    <Modal
      portal
      active={activeModal}
      setActive={setActiveModal}
      bodyClassName={styles.complaint_modal_body}
    >
      {success && <div className={styles.complaint_success} >Жалоба отправлена</div> }
      { !success &&
        <form onSubmit={onSubmit} >

          <div className={styles.text} >
            <b className={styles.title} >Жалоба</b>
            <p>Пользователь {user.name} {user.surname} сообщает о нарушении со стороны <span>{post.name} {post.surname}</span></p>
            <span>{formatDate(new Date())}</span>
          </div>

          <div className={`${styles.select} ${styles.dropdown} ${selectOpen ? styles.dropdown_open : ''}`}>
            <button 
              className={classNames(styles.dropdown__button, selectOpen ? styles._active : '')} 
              type="button"
              onClick={() => setSelectOpen(prevState => !prevState)}
            >
              {reason?.text || 'Причина жалобы'}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 9.16602L11 14.666L16.5 9.16602" stroke="#2A2A2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>

            <ul className={styles.dropdown__menu}>
              {reasons?.map(reason => (
                <li
                  key={reason.id}
                  className={styles.dropdown__menuItem}
                  onClick={() => chooseReason(reason.title, reason.id)}
                >
                  {reason.title}
                </li>
              ))}
            </ul>
          </div>

          <b className={styles.subtitle} >Подробности жалобы</b>

          <textarea
            name="description"
            placeholder='Укажите, пожалуйста, что именно вас беспокоит и почему вы считаете это нарушением'
          ></textarea>

          {errorMessage && <div style={{ display: 'flex', justifyContent: 'center', color: 'red', fontSize: '18px' }} >{errorMessage}</div> }

          <Button type='submit' >Отправить жалобу</Button>

        </form>
      }
    </Modal>
  </>)
}

function formatDate( date: Date ) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const result = `${day}.${month}.${year}`
  return result
}


export default DropdownMenu