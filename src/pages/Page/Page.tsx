import React, {useEffect, useState} from 'react';
import styles from '../SingleNewsPage/SingleNewsPage.module.scss';
import Tag from "../../components/Tag/Tag";
import calendarIcon from "../../images/svg/calendar.svg";
import {useParams} from "react-router-dom";
import axios from "axios";
import {formatDate} from "../../App";


const Page = () => {

    const [page, setPage] = useState(null);

    const { url } = useParams();

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await axios.get(`https://api-rubin.multfilm.tatar/api/pages/${url}`);
                setPage(response.data.data)
            } catch (error) {
                console.error('Ошибка при получении страницы:', error);
            }
        };
        fetchPage()
    }, [url])

    if (!page) {
        return <p>Загрузка...</p>
    }

    return (
        <div className="page">
            <div className={styles.news}>
                {
                    page?.caption && (
                        <div className={styles.news__cover}>
                            {
                                //@ts-ignore
                                <img src={page.caption} alt=""/>
                            }
                        </div>
                    )
                }
                <div className={styles.news__innerWrapper}>
                    <div className={styles.news__info}>
                        <h1 className={styles.news__title}>{page?.title}</h1>
                        <div className={styles.news__subheader}>
                            {
                                <Tag icon={calendarIcon} count={formatDate(page?.created_at)}/>
                            }
                        </div>
                        <div className={styles.news__text}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: page?.full_content
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;