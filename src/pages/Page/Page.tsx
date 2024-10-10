import React, {useEffect, useState} from 'react';
import styles from '../SingleNewsPage/SingleNewsPage.module.scss';
import Tag from "../../components/Tag/Tag";
import calendarIcon from "../../images/svg/calendar.svg";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";
import {formatDate} from "../../App";
import {MemoryGame} from "../../components/MemoryGame/MemoryGame";
import {Box} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


const Page = () => {

    const location = useLocation();
    const { component } = location.state || {};

    useEffect(() => {
        console.log(component)
    }, [component])

    useEffect(() => {
        console.log(location.state)
    }, [])

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
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}
            >
                <CircularProgress
                    size="3rem"
                    sx={{ color: '#91172C' }}
                />
            </Box>
        )
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
                        <div>
                            {url === 'game-memory' && <MemoryGame
                                titleText="Игра в память"
                                winMessage="Поздравляем! Вы выиграли!"
                                loseMessage="Вы проиграли. Попробуйте снова!"
                            />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;