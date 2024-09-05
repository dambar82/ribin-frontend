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
import { classNames } from '../../shared/utils'

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
        title: 'Записи',
        link: '/posts'
    },
    {
        title: 'Клубы',
        link: '/clubs'
    },
    {
        title: 'Спорт для школьников',
        link: '/sportslife'
    },
    {
        title: 'Мероприятия',
        link: '/events'
    },
]

const Footer = () => {

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/ump.docx';
        link.download = 'УМП для учителей.docx';
        link.click();
    };

    return (
            <div className={styles.footer}>
                <div className={`${styles.footer_whitePart} justify_content_SB content`}>
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
                        <h3 className={styles.footer_number}>
                            8 800 550 1958
                        </h3>
                        {/*<div className={styles.footer_links_flex}>*/}
                        {/*    <div className={styles.footer_link}>*/}
                        {/*        Адрес: ул. Спортивная, д. 1, г. Казань*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className={styles.footer_links_flex}>
                            <div className={styles.footer_link}>
                                rubinkids@yandex.ru
                            </div>
                        </div>
                        {/*<div className={styles.socialMedia_flex}>*/}
                        {/*    <a href='https://vk.com'>*/}
                        {/*        <div className={styles.socialMedia}>*/}
                        {/*            <img src={vk} alt=""/>*/}
                        {/*        </div>*/}
                        {/*    </a>*/}
                        {/*    <a href='https://web.telegram.org/'>*/}
                        {/*        <div className={styles.socialMedia}>*/}
                        {/*            <img src={tg} alt=""/>*/}
                        {/*        </div>*/}
                        {/*    </a>*/}
                        {/*    <a href='https://web.telegram.org/'>*/}
                        {/*        <div className={styles.socialMedia}>*/}
                        {/*            <img src={youtube} alt=""/>*/}
                        {/*        </div>*/}
                        {/*    </a>*/}
                        {/*    <a href='https://web.telegram.org/'>*/}
                        {/*        <div className={styles.socialMedia}>*/}
                        {/*            <img src={tiktok} alt=""/>*/}
                        {/*        </div>*/}
                        {/*    </a>*/}
                        {/*    <a href='https://web.telegram.org/'>*/}
                        {/*        <div className={styles.socialMedia}>*/}
                        {/*            <img src={twitter} alt=""/>*/}
                        {/*        </div>*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className={`${styles.footer_redPart} `}>
                    <div className={classNames('content', 'justify_content_SB')} >
                      <p>
                          © 2024 Детский футбольный клуб "Рубин".  <br/>Все права защищены.
                      </p>
                      <div className={styles.footer_redPart_right}>
                          <Link to='https://dnevnik.rubin-kazan.ru/page/rulez'>
                              <p>
                                  Политика конфиденциальности
                              </p>
                          </Link>
                          <p onClick={handleDownload}>
                              Методические комментарии для педагогов
                          </p>
                      </div>
                    </div>
                </div>
            </div>

    );
};

export default Footer;