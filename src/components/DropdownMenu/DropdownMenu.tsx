<<<<<<< HEAD
import {useEffect, useState} from 'react'
import styles from './DropdownMenu.module.scss'
import {PostAnswer} from "../../store/postSlice";

interface IDropdownMenu {
    isAuthor: boolean;
}

const DropdownMenu = ({isAuthor}: IDropdownMenu) => {
    const [open, setOpen] = useState(false)

=======
import { useState } from 'react'
import styles from './DropdownMenu.module.scss'

const DropdownMenu = () => {
    const [open, setOpen] = useState(false)
>>>>>>> origin/anauthorized-access
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
<<<<<<< HEAD
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
=======
            <li className={styles.dropdown__menuItem}>Открыть в новом окне</li>
            <li className={styles.dropdown__menuItem}>Пожаловаться</li>
>>>>>>> origin/anauthorized-access
        </ul>
    </div>
    )
}

export default DropdownMenu