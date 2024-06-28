import React from 'react';
import styles from './Footer.module.scss';
import rubyLogo from '../../images/rubyLogo.svg';
import ruby from '../../images/svg/ruby.svg';
import {Link} from "react-router-dom";
import vk from '../../images/svg/vk.svg';
import tg from '../../images/svg/tg.svg';
import youtube from '../../images/svg/youtube.svg';
import tiktok from '../../images/svg/tiktok.svg';
import twitter from '../../images/svg/twitter.svg';

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
        title: 'Спорт для школьников',
        link: '/sport'
    },
    {
        title: 'Жизнь спортивного клуба',
        link: '/sportslife'
    },
]

const Footer = () => {
    return (
        <div className='content'>
            <div className={styles.footer}>
                <div className={`${styles.footer_whitePart} justify_content_SB`}>
                    <div className={styles.footer_logos}>
                        <img src={ruby} alt=""/>
                        <img src={rubyLogo} alt=""/>
                    </div>
                    <div className={styles.footer_links}>
                        <h3>
                            О клубе
                        </h3>
                        <div className={styles.footer_links_flex}>
                            {
                                menuLinks.map((link: IMenuLink) => (
                                    <Link to={link.link} key={link.link}>
                                        <div className={styles.footer_link}>
                                            {link.title}
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className={styles.footer_links}>
                        <h3>
                            +7 (123) 456-78-90
                        </h3>
                        <div className={styles.footer_links_flex}>
                            <div className={styles.footer_link}>
                                Адрес: ул. Спортивная, д. 1, г. Казань
                            </div>
                        </div>
                        <div className={styles.footer_links_flex}>
                            <div className={styles.footer_link}>
                                info@rubinclub.ru
                            </div>
                        </div>
                        <div className={styles.socialMedia_flex}>
                            <a href='https://vk.com'>
                                <div className={styles.socialMedia}>
                                    <img src={vk} alt=""/>
                                </div>
                            </a>
                            <a href='https://web.telegram.org/'>
                                <div className={styles.socialMedia}>
                                    <img src={tg} alt=""/>
                                </div>
                            </a>
                            <a href='https://web.telegram.org/'>
                                <div className={styles.socialMedia}>
                                    <img src={youtube} alt=""/>
                                </div>
                            </a>
                            <a href='https://web.telegram.org/'>
                                <div className={styles.socialMedia}>
                                    <img src={tiktok} alt=""/>
                                </div>
                            </a>
                            <a href='https://web.telegram.org/'>
                                <div className={styles.socialMedia}>
                                    <img src={twitter} alt=""/>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`${styles.footer_redPart} justify_content_SB`}>
                    <p>
                        © 2024 Детский футбольный клуб "Рубин".  <br/>Все права защищены.
                    </p>
                    <div className={styles.footer_redPart_right}>
                        <p>
                            Политика конфиденциальности
                        </p>
                        <p>
                            Условия использования
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;