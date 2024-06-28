import React from 'react';
import styles from './AuthHeader.module.scss';
import rubyLogo from '../../../images/rubyLogo.svg';
import profilePic from '../../../images/svg/profilePic.svg';
import buttonArrowDown from '../../../images/svg/button_arrow_down.svg';
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {Link} from "react-router-dom";
import loupePic from '../../../images/svg/loupe.svg';

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
        title: 'Люди',
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
        link: '/sport'
    },
    {
        title: 'Активности клуба',
        link: '/sportslife'
    },
]

const AuthHeader = () => {

    const { user } = useSelector((state: RootState) => state.user);

    return (
        <div className={styles.authHeader}>
            <div className={`justify_content_SB ${styles.authHeader_up}`}>
                <img src={rubyLogo} alt=""/>
                <div className='profile_button'>
                    <img src={profilePic} alt=""/>
                    <span>{user?.name}</span>
                    <img src={buttonArrowDown} alt=""/>
                </div>
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