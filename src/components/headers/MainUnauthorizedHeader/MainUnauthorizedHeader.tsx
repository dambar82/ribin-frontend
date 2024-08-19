import React from 'react';
import styles from "../AuthHeader/AuthHeader.module.scss";
import rubyLogo from "../../../images/rubyLogo.svg";
import profilePic from "../../../images/svg/profilePic.svg";
import buttonArrowDown from "../../../images/svg/button_arrow_down.svg";
import {Link} from "react-router-dom";
import loupePic from "../../../images/svg/loupe.svg";

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
        link: '/rubylife'
    },
    {
        title: 'Активности клуба',
        link: '/sportslife'
    },
]

const MainUnauthorizedHeader = () => {
    return (
        <div className='content'>
            <div className={styles.authHeader}>
                <div className={`justify_content_SB ${styles.authHeader_up}`}>
                    <img src={rubyLogo} alt=""/>
                    <Link to='/login'>
                        <div className='cabinet_button'>
                            Личный кабинет
                        </div>
                    </Link>
                </div>
                <div className={styles.authHeader_menu}>
                    {
                        menuLinks.map((link: IMenuLink) => (
                            <Link to={link.link} key={link.link} className={styles.menuLink} >
                              {link.title}
                            </Link>
                        ))
                    }
                    {/* <div className={styles.menuSearchbar}>
                        <input type="text" placeholder="Поиск"/>
                        <img src={loupePic} alt=""/>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default MainUnauthorizedHeader;