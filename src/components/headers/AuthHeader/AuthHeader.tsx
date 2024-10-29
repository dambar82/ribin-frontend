import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {NavLink, Link, useNavigate} from "react-router-dom";

import {useAppDispatch} from "../../../store/hooks";
import {RootState} from "../../../store/store";

import styles from './AuthHeader.module.scss';
import rubik from '../../../images/svg/rubik.svg'
import rubyLogo from '../../../images/rubyLogo.svg';
import profilePic from '../../../images/svg/profilePic.svg';
import buttonArrowDown from '../../../images/svg/button_arrow_down.svg';
import buttonArrowUp from '../../../images/svg/buttonArrowUp.svg';
import loupePic from '../../../images/svg/loupe.svg';
import { logout } from '../../../store/userSlice';
import myProfile from '../../../images/svg/myProfile.svg';
import friendsLogo from '../../../images/svg/friendsLogo.svg';
import messages from '../../../images/svg/messages.svg';
import awards from '../../../images/svg/awards.svg';
import options from '../../../images/svg/options.svg';
import blackArrowDown from '../../../images/svg/blackArrowDown.svg';
import blackArrowUp from '../../../images/svg/blackArrowUp.svg';
import { classNames } from '../../../shared/utils'
import axios from 'axios'
import { Logo } from '../../../shared/UI'
import {selectAward, setAward} from "../../../store/awardSlice";

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
    { title: "Фотогалерея", link: "/photogallery" },
];

const AuthHeader = () => {

    const { user } = useSelector((state: RootState) => state.user);

    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [activeMenu, setActiveMenu] = useState(false);

    const profileSubMenuRef = useRef(null);
    const rubinLifeSubMenuRef = useRef(null);
    const clubActivitiesSubMenuRef = useRef(null);
    const profileButtonRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

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
            (!clubActivitiesSubMenuRef.current || !clubActivitiesSubMenuRef.current.contains(event.target)) &&
            (!profileButtonRef.current || !profileButtonRef.current.contains(event.target))
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

    const goToProfile = () => {
        window.location.href = `/user/${user.id}`;
    }

    const award = useSelector(selectAward);
//d
    const handleClick = () => {
        dispatch(setAward(false));
    };

    return (
        <div className={styles.authHeader}>
            <div className={`${styles.authHeader_up}`}>
                <div className={styles.logo_wrapper} >
                    <Link to='/'>
                        <img src={rubyLogo} alt=""/>
                    </Link>
                </div>
                <Link to='https://dnevnik.rubin-kazan.ru/page/book-rubin' className={styles.header_button} >
                  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" fill="#91172C"/><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" stroke="white" stroke-width="3"/><path d="M37.8294 32.9117C37.8803 32.923 37.9283 32.9286 37.9791 32.9286C38.3575 32.9286 38.6822 32.6209 38.6822 32.2227V19.5192C38.6822 19.2114 38.4845 18.9404 38.1909 18.8472C37.5584 18.6439 36.3584 18.3107 34.876 18.1272V21.7668C34.876 22.1113 34.4863 22.3118 34.2068 22.1113L33.2552 21.4336C33.1084 21.3292 32.9107 21.3292 32.7639 21.4336L31.8124 22.1113C31.5328 22.3118 31.1432 22.1113 31.1432 21.7668V18.0876C29.4857 18.2599 28.1416 18.6354 27.4668 18.8528V33.0021C28.6188 32.6999 30.5954 32.4994 32.8402 32.4994C34.8533 32.4994 36.652 32.6576 37.8294 32.9117Z" fill="white"/><path d="M16.0214 32.9257C16.0694 32.9257 16.1203 32.9201 16.1711 32.9088C17.3514 32.6575 19.1472 32.4965 21.1604 32.4965C23.4052 32.4965 25.3818 32.697 26.5338 32.9991V18.8527C25.6415 18.5675 23.5718 18 21.1604 18C18.7688 18 16.7132 18.5591 15.8097 18.8471C15.516 18.9403 15.3184 19.2113 15.3184 19.5191V32.2198C15.3184 32.6179 15.6431 32.9257 16.0214 32.9257Z" fill="white"/><path d="M15.0673 34.97C15.1435 35.3512 15.5134 35.6025 15.8974 35.5262L16.0358 35.498C17.2528 35.258 19.0458 35.1197 20.9517 35.1197C23.7895 35.1197 25.8902 35.419 26.7119 35.7182C26.8051 35.7521 26.9039 35.7691 26.9999 35.7691C27.096 35.7691 27.1948 35.7521 27.288 35.7182C28.1096 35.4218 30.2104 35.1197 33.0482 35.1197C34.9541 35.1197 36.7471 35.258 37.9641 35.498L38.1025 35.5262C38.4836 35.6025 38.8564 35.354 38.9326 34.97L38.9862 34.6932C39.0625 34.312 38.814 33.9394 38.43 33.8631L38.2916 33.8349C38.286 33.8349 38.2831 33.832 38.2775 33.832C36.956 33.5723 35.0529 33.4226 33.0482 33.4226C30.5351 33.4226 28.2678 33.6514 26.9999 34.0269C25.7321 33.6514 23.4648 33.4226 20.9517 33.4226C18.9469 33.4226 17.041 33.5723 15.7224 33.832C15.7167 33.832 15.7139 33.8349 15.7082 33.8349L15.5699 33.8631C15.1887 33.9394 14.9374 34.3093 15.0136 34.6932L15.0673 34.97Z" fill="white"/></svg>
                  Спортивный дневник
                </Link>
                <Link to='/download-app' target='_blank' className={styles.header_button} >
                  <svg width="91" height="54" viewBox="0 0 91 54" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="43" y="3" width="48" height="48" rx="24" fill="#91172C"/><g clip-path="url(#clip0_4002_5636)"><path d="M70.4025 19.5603C71.7326 17.969 71.6098 16.5197 71.5713 16C70.397 16.0688 69.0376 16.8058 68.264 17.7142C67.4115 18.6867 66.91 19.8903 67.0173 21.2452C68.2878 21.3442 69.4474 20.686 70.4025 19.5603Z" fill="white"/><path d="M57.833 27.8617C57.833 29.1487 58.0668 30.4788 58.5343 31.8502C59.1576 33.6523 61.408 38.0734 63.7556 38.0001C64.983 37.9707 65.8502 37.121 67.4479 37.121C68.9971 37.121 69.801 38.0001 71.1687 38.0001C73.5355 37.9652 75.5723 33.9484 76.1663 32.1407C72.991 30.6328 73.1615 27.7197 73.1615 27.6271H73.1597C73.1505 25.8249 73.959 24.4637 75.5953 23.4617C74.6795 22.1408 73.2972 21.413 71.4703 21.2709C69.7414 21.1334 67.8513 22.2875 67.1601 22.2875C66.4295 22.2875 64.7529 21.3204 63.4393 21.3204C60.7205 21.3626 57.833 23.5048 57.833 27.8617Z" fill="white"/></g><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" fill="#91172C"/><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" stroke="white" stroke-width="3"/><g clip-path="url(#clip1_4002_5636)"><path d="M32.1397 30.1983L29.7513 27.85L20.9838 36.4958L32.1397 30.1983ZM32.1397 23.8058L20.9838 17.5083L29.7513 26.1542L32.1397 23.8058ZM35.6355 28.1892C36.3505 27.6308 36.3505 26.3725 35.588 25.8142L33.248 24.4825L30.6372 27.0025L33.248 29.5225L35.6355 28.1892ZM18.6947 37L28.8897 26.9983L18.6947 17.0008V17C18.1788 17.2658 17.833 17.75 17.833 18.3792V35.6208C17.833 36.25 18.1788 36.7342 18.6947 37Z" fill="white"/></g><defs><clipPath id="clip0_4002_5636"><rect width="22" height="22" fill="white" transform="translate(56 16)"/></clipPath><clipPath id="clip1_4002_5636"><rect width="20" height="20" fill="white" transform="translate(17 17)"/></clipPath></defs></svg>
                  FC Rubin AR
                </Link>
                { !user &&
                  <Link to='/login'>
                      <div className={styles.cabinet_button}>
                          <span>Личный кабинет</span>
                          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2517_46390)"><rect width="36" height="36" rx="18" fill="white"/><path d="M27 31C27 28.6131 26.0518 26.3239 24.364 24.636C22.6761 22.9482 20.3869 22 18 22C15.6131 22 13.3239 22.9482 11.636 24.636C9.94821 26.3239 9 28.6131 9 31" fill="#91172C"/><path d="M27 31C27 28.6131 26.0518 26.3239 24.364 24.636C22.6761 22.9482 20.3869 22 18 22C15.6131 22 13.3239 22.9482 11.636 24.636C9.94821 26.3239 9 28.6131 9 31V36V38H27V31Z" stroke="#91172C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 22C21.3137 22 24 19.3137 24 16C24 12.6863 21.3137 10 18 10C14.6863 10 12 12.6863 12 16C12 19.3137 14.6863 22 18 22Z" fill="#91172C" stroke="#91172C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="9" y="31" width="17" height="6" fill="#91172C"/></g><rect x="1" y="1" width="34" height="34" rx="17" stroke="white" strokeWidth="2"/><defs><clipPath id="clip0_2517_46390"><rect width="36" height="36" rx="18" fill="white"/></clipPath></defs></svg>
                      </div>
                    </Link>
                  }
                {user && (
                    <div className='profile_button' ref={profileButtonRef} onClick={(event) => toggleSubMenu('profile', event)}>
                        <div className={`profile_button_avatar`}>
                            <img src={user.avatar} alt=""/>
                        </div>
                        <span className={styles.userName}>{user.name}</span>
                        {activeSubMenu === 'profile' ? (
                            <img src={buttonArrowUp} alt=""/>
                        ) : (
                            <img src={buttonArrowDown} alt=""/>
                        )}
                        {activeSubMenu === 'profile' && (
                            <div className='profile_button_subMenu' ref={profileSubMenuRef} onClick={handleSubMenuClick}>
                                <ul>
                                  <div>
                                    <div className={`profile_button_avatar`}>
                                      <img src={user.avatar} alt=""/>
                                    </div>
                                    <span>{user.name}</span>
                                  </div>
                                    <li onClick={goToProfile}>
                                        <NavLink
                                            to=''
                                            className={({ isActive }) => {
                                                return isActive ? "_active" : ""
                                            }}
                                        >
                                            <img src={myProfile} alt=""/>
                                            <span>Мой профиль</span>
                                            {
                                                user.filled === 0 && <img src={rubik} style={{marginLeft: 'auto'}} alt=""/>
                                            }
                                        </NavLink>
                                    </li>
                                    <li>
                                       <NavLink
                                            to={`/user/${user.id}/friends`}
                                            className={({ isActive }) => {
                                                return isActive ? '_active' : ''
                                            }}
                                       >
                                           <img src={friendsLogo} alt=""/>
                                           <span>Друзья</span>
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
                                    <li onClick={handleClick}>
                                        <NavLink
                                            to={`/awards`}
                                            className={({isActive}) => {
                                                return isActive ? "_active" : ''
                                            }}
                                        >
                                            <img src={awards} alt=""/>
                                            <span>Вознаграждения</span>
                                            {
                                                award && <div className={styles.awardNotify}>1</div>
                                            }
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
                                            {
                                                user.filled === 0 && <img src={rubik} style={{marginLeft: 'auto'}} alt=""/>
                                            }
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
                    <NavLink key={link.title} to={link.link} className={isActive} onClick={closeMobileMenu} >{ link.title }</NavLink>
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
                                    { name: "Тренерский состав", path: "/academy-coaches" },
                                    // { name: 'Активисты', path: "/students" },
                                    { name: "Программы и предложения клуба", path: "/programs" },
                                    { name: "Достижения", path: "/achievements" },
                                ].map(({ name, path }) => {
                                    return (
                                        <li key={name}>
                                            <NavLink
                                                to={path}
                                                className={({ isActive }) => {
                                                    return isActive ? "_active" : ""
                                                }}
                                                onClick={closeMobileMenu}
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
                                    { name: 'Клубы', path: '/clubs' },
                                ].map(({ name, path }) => {
                                    return (
                                        <li>
                                            <NavLink
                                                key={name}
                                                to={path}
                                                className={({ isActive }) => {
                                                    return isActive ? "_active" : ""
                                                }}
                                                onClick={closeMobileMenu}
                                            >{name}</NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
                <Logo />
                {/* <div className={styles.menuSearchbar}>
                    <input type="text" placeholder="Поиск"/>
                    <img src={loupePic} alt=""/>
                </div> */}
            </div>
        </div>
    );
};

export default AuthHeader;
