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
import { classNames } from '../../../shared/utils'
import axios from 'axios'

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

    const { user } = useSelector((state: RootState) => state.user);

    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [activeMenu, setActiveMenu] = useState(false);

    const profileSubMenuRef = useRef(null);
    const rubinLifeSubMenuRef = useRef(null);
    const clubActivitiesSubMenuRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        console.log(user)
    }, [user])

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const toggleSubMenu = (menuName: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setActiveSubMenu((prevMenuName) => (prevMenuName === menuName ? null : menuName));
    };

    const handleClickOutside = (event) => {
        if (
            activeSubMenu &&
            (!profileSubMenuRef.current || !profileSubMenuRef.current.contains(event.target)) &&
            (!rubinLifeSubMenuRef.current || !rubinLifeSubMenuRef.current.contains(event.target)) &&
            (!clubActivitiesSubMenuRef.current || !clubActivitiesSubMenuRef.current.contains(event.target))
        ) {
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

    const openMobileMenu = () => {
        setActiveMenu(true)
    }

    const closeMobileMenu = () => {
        setActiveMenu(false)
    }

    return (
        <div className={styles.authHeader}>
            <div className={`${styles.authHeader_up}`}>
                <div className={styles.logo_wrapper} >
                    <Link to='/'>
                        <img src={rubyLogo} alt=""/>
                    </Link>
                </div>
                { !user &&
                    <Link to='/login'>
                        <div className={styles.cabinet_button}>
                            Личный кабинет
                        </div>
                    </Link>
                }
                {/* <button onClick={async () => {
                  const $api = axios.create({
                    baseURL: 'https://api-rubin.multfilm.tatar'
                  })
                  $api.interceptors.request.use(config => {
                    const token = JSON.parse(localStorage.getItem('token') || '0')
                    if (token) {
                      config.headers.Authorization = `Bearer ${token}`
                    }
                    return config
                  })
                const res = await $api.delete(`https://api-rubin.multfilm.tatar/api/clients/${user.id}`)
              }} >Удалить</button> */}
                {user && (
                    <div className='profile_button' onClick={(event) => toggleSubMenu('profile', event)}>
                        <div className={`profile_button_avatar`}>
                            <img src={user.avatar} alt=""/>
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
                                            to={`/user/${user.id}`}
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
                                            to={`/chat/${user.id}`}
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
                <div className={styles.sub_menu_button} onClick={openMobileMenu} >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </div>

            <div
                className={classNames(styles.authHeader_menu, activeMenu ? styles._active : '')}
                ref={menuRef}
            >
                <div className={styles.close} onClick={closeMobileMenu} ></div>

                {menuLinks.map((link: IMenuLink) => (
                    <NavLink key={link.title} to={link.link} className={isActive}>{ link.title }</NavLink>
                ))}

                <div ref={rubinLifeSubMenuRef} className={styles.menuLink} onClick={(event) => toggleSubMenu('rubinLife', event)}>
                    <div>
                        Жизнь “Рубина”
                        {activeSubMenu === 'rubinLife' ? <img src={blackArrowUp} alt=""/> : <img src={blackArrowDown} alt=""/>}
                    </div>
                    {activeSubMenu === 'rubinLife' && (
                        <div className='submenu' onClick={handleSubMenuClick}>
                            <ul>
                                {[
                                    { name: "Активисты клуба", path: "/students" },
                                    { name: "Тренерский состав", path: "/academy-coaches" },
                                    { name: "Программы и предложения клуба", path: "/programs" },
                                    { name: "Достижения", path: "/awards" },
                                    { name: "Фотогалерея", path: "/photogallery" },
                                ].map(({ name, path }) => {
                                    return (
                                        <li key={name}>
                                            <NavLink
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
                <div ref={clubActivitiesSubMenuRef} className={styles.menuLink} onClick={(event) => toggleSubMenu('clubActivities', event)}>
                    <div>
                        Активности
                        {activeSubMenu === 'clubActivities' ? <img src={blackArrowUp} alt=""/> : <img src={blackArrowDown} alt=""/>}
                    </div>
                    {activeSubMenu === 'clubActivities' && (
                        <div className='submenu' onClick={handleSubMenuClick}>
                            <ul>
                                {[
                                    { name: "Спорт для школьников", path: "/sportslife" },
                                    { name: "Викторины", path: "/quizzes" },
                                    { name: "Мероприятия", path: "/events" },
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
                {/* <div className={styles.menuSearchbar}>
                    <input type="text" placeholder="Поиск"/>
                    <img src={loupePic} alt=""/>
                </div> */}
            </div>
        </div>
    );
};

export default AuthHeader;