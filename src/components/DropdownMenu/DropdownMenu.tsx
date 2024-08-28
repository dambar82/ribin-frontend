import {useEffect, useState} from 'react'
import styles from './DropdownMenu.module.scss'
import {PostAnswer} from "../../store/postSlice";

interface IDropdownMenu {
    isAuthor: boolean;
}

const DropdownMenu = ({isAuthor}: IDropdownMenu) => {
    const [open, setOpen] = useState(false)

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
                        <li className={styles.dropdown__menuItem}>Редактировать</li>
                        <li className={styles.dropdown__menuItem}>Удалить</li>
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