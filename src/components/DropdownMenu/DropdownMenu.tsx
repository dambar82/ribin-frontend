import {useEffect, useState} from 'react'
import styles from './DropdownMenu.module.scss'
import {PostAnswer} from "../../store/postSlice";

interface IDropdownMenu {
    isAuthor: boolean;
    deleteClick: () => void;
    editClick: () => void;
}

const DropdownMenu = ({isAuthor, deleteClick, editClick}: IDropdownMenu) => {

    const [open, setOpen] = useState(false)

    const handleEditClick = () => {
        setOpen(false); // Закрываем меню
        editClick(); // Вызываем функцию редактирования
    };

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
                !isAuthor && (
                    <li className={styles.dropdown__menuItem}>Пожаловаться</li>
                )
            }
        </ul>
    </div>
    )
}

export default DropdownMenu