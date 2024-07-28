import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {NavLink, Link} from "react-router-dom";

import {useAppDispatch} from "../../../store/hooks";
import {RootState} from "../../../store/store";

import styles from './AuthHeader.module.scss';

import rubyLogo from '../../../images/rubyLogo.svg';
import profilePic from '../../../images/svg/profilePic.svg';
import buttonArrowDown from '../../../images/svg/button_arrow_down.svg';
import buttonArrowUp from '../../../images/svg/buttonArrowUp.svg';
import loupePic from '../../../images/svg/loupe.svg';
import { logout } from '../../../store/userSlice';
import myProfile from '../../../images/svg/myProfile.svg';
import messages from '../../../images/svg/messages.svg';
import options from '../../../images/svg/options.svg';
import blackArrowDown from '../../../images/svg/blackArrowDown.svg';
import blackArrowUp from '../../../images/svg/blackArrowUp.svg';

interface IMenuLink {
    title: string;
    link: string;
}

const menuLinks: IMenuLink[] = [
    { title: 'Главная', link: '/' },
    { title: 'Пользователи', link: '/people' },
    { title: 'Конкурсы', link: '/contests' },
    { title: 'Новости', link: '/news' },
    { title: 'Записи', link: '/posts' },
    { title: 'Клубы', link: '/clubs' },
];

const AuthHeader = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.user);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const profileSubMenuRef = useRef(null);
    const rubinLifeSubMenuRef = useRef(null);
    const clubActivitiesSubMenuRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
    };

    const toggleSubMenu = (menuName: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setActiveSubMenu((prevMenuName) => (prevMenuName === menuName ? null : menuName));
    };

    const handleClickOutside = (event) => {
        if (activeSubMenu &&
            (!profileSubMenuRef.current || !profileSubMenuRef.current.contains(event.target)) &&
            (!rubinLifeSubMenuRef.current || !rubinLifeSubMenuRef.current.contains(event.target)) &&
            (!clubActivitiesSubMenuRef.current || !clubActivitiesSubMenuRef.current.contains(event.target))) {
            setActiveSubMenu(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeSubMenu]);

    const handleSubMenuClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setActiveSubMenu(null);
    };

    function isActive({ isActive }) {
        return isActive ? `${styles.menuLink} ${styles.menuLink_active}` : styles.menuLink
    }

    return (
        <div className={styles.authHeader}>
            <div className={`justify_content_SB ${styles.authHeader_up}`}>
                <img src={rubyLogo} alt=""/>
                {user && (
                    <div className='profile_button' onClick={(event) => toggleSubMenu('profile', event)}>
                        <div className={`profile_button_avatar`}>
                            <img src={user.image} alt=""/>
                        </div>
                        <span>{user.name}</span>
                        {activeSubMenu === 'profile' ? (
                            <img src={buttonArrowUp} alt=""/>
                        ) : (
                            <img src={buttonArrowDown} alt=""/>
                        )}
                        {activeSubMenu === 'profile' && (
                            <div className='profile_button_subMenu' ref={profileSubMenuRef} onClick={handleSubMenuClick}>
                                <ul>
                                    <li>
                                        <NavLink 
                                            to="/profile" 
                                            className={({ isActive }) => {
                                                return isActive ? "_active" : ""
                                            }}
                                        >
                                            <img src={myProfile} alt=""/>
                                            <span>Мой профиль</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/messages" 
                                            className={({ isActive }) => {
                                                return isActive ? "_active" : ""
                                            }}
                                        >
                                            <img src={messages} alt=""/>
                                            <span>Сообщения</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/settings" 
                                            className={({ isActive }) => {
                                                return isActive ? "_active" : ""
                                            }}
                                        >
                                            <img src={options} alt=""/>
                                            <span>Настройки</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/feedback" 
                                            className={({ isActive }) => {
                                                return isActive ? "_active" : ""
                                            }}
                                        >
                                            <img src='/images/heart.svg' alt=""/>
                                            <span>Обратная связь</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/help" 
                                            className={({ isActive }) => {
                                                return isActive ? "_active" : ""
                                            }}
                                        >
                                            <img src='/images/question.svg' alt=""/>
                                            <span>Помощь</span>
                                        </NavLink>
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
                    <NavLink key={link.title} to={link.link} className={isActive}>{ link.title }</NavLink>
                ))}
                <div className={styles.menuLink} onClick={(event) => toggleSubMenu('rubinLife', event)}>
                    Жизнь “Рубина”
                    {activeSubMenu === 'rubinLife' ? <img src={blackArrowUp} alt=""/> : <img src={blackArrowDown} alt=""/>}
                    {activeSubMenu === 'rubinLife' && (
                        <div className='submenu' ref={rubinLifeSubMenuRef} onClick={handleSubMenuClick}>
                            <ul>
                                {[
                                    { name: "Активисты клуба", path: "/students" },
                                    { name: "Тренерский состав", path: "/academy-coaches" }, 
                                    { name: "Программы и предложения клуба", path: "/programs" }, 
                                    { name: "Достижения", path: "/awards" }, 
                                    { name: "Фотогалерея", path: "/photogallery" }, 
                                ].map(({ name, path }) => {
                                    return (
                                        <li>
                                            <NavLink 
                                                key={name} 
                                                to={path} 
                                                className={({ isActive }) => {
                                                    return isActive ? "_active" : ""
                                                }}
                                            >{name}</NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
                <div className={styles.menuLink} onClick={(event) => toggleSubMenu('clubActivities', event)}>
                    Активности клуба
                    {activeSubMenu === 'clubActivities' ? <img src={blackArrowUp} alt=""/> : <img src={blackArrowDown} alt=""/>}
                    {activeSubMenu === 'clubActivities' && (
                        <div className='submenu' ref={clubActivitiesSubMenuRef} onClick={handleSubMenuClick}>
                            <ul>
                                {[
                                    { name: "Спорт для школьников", path: "/sportslife" },
                                    { name: "Викторины", path: "/quizzes" }, 
                                    { name: "Мероприятия", path: "/сlubs/:id/events" },  
                                ].map(({ name, path }) => {
                                    return (
                                        <li>
                                            <NavLink 
                                                key={name} 
                                                to={path} 
                                                className={({ isActive }) => {
                                                    return isActive ? "_active" : ""
                                                }}
                                            >{name}</NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
                <div className={styles.menuSearchbar}>
                    <input type="text" placeholder="Поиск"/>
                    <img src={loupePic} alt=""/>
                </div>
            </div>
        </div>
    );
};

export default AuthHeader;