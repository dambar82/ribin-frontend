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
                <div className={styles.menuLink} onClick={(event) => toggleSubMenu('rubinLife', event)}>
                    Жизнь “Рубина”
                    {activeSubMenu === 'rubinLife' ? <img src={blackArrowUp} alt=""/> : <img src={blackArrowDown} alt=""/>}
                    {activeSubMenu === 'rubinLife' && (
                        <div className='submenu' ref={rubinLifeSubMenuRef} onClick={handleSubMenuClick}>
                            <ul>
                                <Link to='/students'>
                                    <li>
                                        Активисты клуба
                                    </li>
                                </Link>
                                <Link to='/academy-coaches'>
                                    <li>
                                        Тренерский состав
                                    </li>
                                </Link>
                                <li>
                                    <Link to='/programs'>
                                        Программы и предложения клуба
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/awards'>
                                        Достижения
                                    </Link>
                                </li>
                                <Link to='/photogallery'>
                                    <li>
                                        Фотогалерея
                                    </li>
                                </Link>
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
                                <li>
                                    <Link to='/sportslife'>
                                        Спорт для школьников
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/quizzes">
                                        Викторины
                                    </Link>
                                </li>
                                <li>
                                    Мероприятия
                                </li>
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