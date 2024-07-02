import React from 'react';
import styles from './AuthHeader.module.scss';
import rubyLogo from '../../../images/rubyLogo.svg';
import profilePic from '../../../images/svg/profilePic.svg';
import buttonArrowDown from '../../../images/svg/button_arrow_down.svg';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../store/hooks";
import {RootState} from "../../../store/store";
import {Link} from "react-router-dom";
import loupePic from '../../../images/svg/loupe.svg';
import { logout } from '../../../store/userSlice';

interface IMenuLink {
    title: string;
    link: string;
}

const menuLinks: IMenuLink[] = [
    {
        title: 'Главная',
        link: '/'
    },
    {
        title: 'Пользователи',
        link: '/people'
    },
    {
        title: 'Конкурсы',
        link: '/contests'
    },
    {
        title: 'Новости',
        link: '/news'
    },
    {
        title: 'Блог',
        link: '/blog'
    },
    {
        title: 'Клубы',
        link: '/clubs'
    },
    {
        title: 'Жизнь “Рубина”',
        link: '/rubylife'
    },
    {
        title: 'Активности клуба',
        link: '/sportslife'
    },
]

const AuthHeader = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    const handleLogout = () => {
        dispatch(logout());
    };


    return (
        <div className={styles.authHeader}>
            <div className={`justify_content_SB ${styles.authHeader_up}`}>
                <img src={rubyLogo} alt=""/>
                {user && (
                    <div className='profile_button'>
                        <img src={user.image} alt=""/>
                        <span>{user.name}</span>
                        <img src={buttonArrowDown} style={{border: '1px solid red'}} alt="" onClick={handleLogout}/>
                    </div>
                )}
            </div>
            <div className={styles.authHeader_menu}>
                {
                    menuLinks.map((link: IMenuLink) => (
                        <Link to={link.link} key={link.link}>
                            <div className={styles.menuLink}>
                                {link.title}
                            </div>
                        </Link>
                    ))
                }
                <div className={styles.menuSearchbar}>
                    <input type="text" placeholder="Поиск"/>
                    <img src={loupePic} alt=""/>
                </div>
            </div>
        </div>
    );
};

export default AuthHeader;