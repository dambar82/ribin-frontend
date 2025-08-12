import styles from "./AwardsPage.module.scss"
import {useEffect, useState} from "react";
import axios from "axios";

// const awards = [
//     { name: "Обладатель Суперкубка России", years: [2010, 2012], icon: "/images/russia-super-cup.svg"},
//     { name: "Двухкратный чемпион России", years: [2008, 2009], icon: "/images/russia-league.svg"},
//     { name: "Обладатель Кубка России", years: ["2011/2012"], icon: "/images/russia-cup.svg"},
//     { name: "Победитель Первой лиги", years: [2002, 2023], icon: "/images/russia-first-league.svg"},
//     { name: "Победитель Кубка Содружества", years: [2010,]},
//     { name: "Четверть-финалист Лиги Европы УЕФА", years: ["2012/2013"]},
//     { name: "Участник группового этапа Лиги Чемпионов УЕФА", years: [2009, 2010]},
//     { name: "Дваждый бронзовый призёр Чемпионата России", years: [2003, 2010]},
//]
const AwardsPage = () => {

    const [awards, setAwards] = useState([]);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const response = await axios.get('https://dnevnik-api.rubin-kazan.ru/api/request/achievements');
                setAwards(response.data);
            } catch (error) {
                console.error('Ошибка при получении достижений', error);
            }
        }
        fetchAwards();
    }, [])

    return (
        <div className="page">
            <section className={`${styles.awards} section`}>
                <div className="section__header">
                    <h1 className="section__title">Достижения</h1>
                </div>
                <div className={`${styles.awards__body} section__body`}>
                    <div className={styles.awards__list}>
                        {[awards.map((award, index) => (
                            <div key={award.title + index} className={styles.award}>
                                <img className={styles.award__image} src={award.imagePreviewResized} alt="" />
                                <div className={styles.award__years}>{ award.years }</div>
                                <div className={styles.award__content}>
                                    <div className={styles.award__name}
                                        dangerouslySetInnerHTML={{
                                            __html: award.title
                                        }}
                                    ></div>
                                    <div className={styles.award__cup}>
                                        {award.imagePreviewResized && <img src={award.imagePreviewResized} alt="" /> }
                                    </div>
                                </div>
                            </div>
                        ))]}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AwardsPage