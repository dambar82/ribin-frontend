import React, {useEffect, useRef, useState} from 'react';
import styles from './AuthHeader.module.scss';
import rubyLogo from '../../../images/rubyLogo.svg';
import profilePic from '../../../images/svg/profilePic.svg';
import buttonArrowDown from '../../../images/svg/button_arrow_down.svg';
import buttonArrowUp from '../../../images/svg/buttonArrowUp.svg';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../store/hooks";
import {RootState} from "../../../store/store";
import {Link} from "react-router-dom";
import loupePic from '../../../images/svg/loupe.svg';
import { logout } from '../../../store/userSlice';
import myProfile from '../../../images/svg/myProfile.svg';
import messages from '../../../images/svg/messages.svg';
import options from '../../../images/svg/options.svg';

interface IMenuLink {
    title: string;
    link: string;
}

const menuLinks: IMenuLink[] = [
    { title: 'Главная', link: '/' },
    { title: 'Пользователи', link: '/people' },
    { title: 'Конкурсы', link: '/contests' },
    { title: 'Новости', link: '/news' },
    { title: 'Блог', link: '/blog' },
    { title: 'Клубы', link: '/clubs' },
    { title: 'Жизнь “Рубина”', link: '/rubylife' },
    { title: 'Активности клуба', link: '/sportslife' },
];

const AuthHeader = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.user);
    const [subMenu, setShowSubmenu] = useState<boolean>(false);
    const subMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        dispatch(logout());
    };

    const onShowSubMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowSubmenu(!subMenu);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (subMenuRef.current && !subMenuRef.current.contains(event.target as Node)) {
            setShowSubmenu(false);
        }
    };

    useEffect(() => {
        if (subMenu) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [subMenu]);

    const handleSubMenuClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div className={styles.authHeader}>
            <div className={`justify_content_SB ${styles.authHeader_up}`}>
                <img src={rubyLogo} alt=""/>
                {user && (
                    <div className='profile_button' onClick={onShowSubMenu}>
                        <div className={`profile_button_avatar`}>
                            <img src={user.image} alt=""/>
                        </div>
                        <span>{user.name}</span>
                        {subMenu ? (
                            <img src={buttonArrowUp} alt=""/>
                        ) : (
                            <img src={buttonArrowDown} alt=""/>
                        )}
                        {subMenu && (
                            <div className='profile_button_subMenu' ref={subMenuRef} onClick={handleSubMenuClick}>
                                <ul>
                                    <li>
                                        <img src={myProfile} alt=""/>
                                        <span>Мой профиль</span>
                                    </li>
                                    <li>
                                        <img src={messages} alt=""/>
                                        <span>Сообщения</span>
                                    </li>
                                    <li>
                                        <img src={options} alt=""/>
                                        <span>Настройки</span>
                                    </li>
                                    <li>
                                        <img src='/images/heart.svg' alt=""/>
                                        <span>Обратная связь</span>
                                    </li>
                                    <li>
                                        <img src='/images/question.svg' alt=""/>
                                        <span>Помощь</span>
                                    </li>
                                    <li className={styles.exitMenu} onClick={handleLogout}>
                                        <img src='/images/exit.svg' alt=""/>
                                        <span>Выйти из аккаунта</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.authHeader_menu}>
                {menuLinks.map((link: IMenuLink) => (
                    <Link to={link.link} key={link.link}>
                        <div className={styles.menuLink}>
                            {link.title}
                        </div>
                    </Link>
                ))}
                <div className={styles.menuSearchbar}>
                    <input type="text" placeholder="Поиск"/>
                    <img src={loupePic} alt=""/>
                </div>
            </div>
        </div>
    );
};

export default AuthHeader;