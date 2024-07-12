import styles from "./Achievements.module.scss"

const achievements = [
    { name: "Обладатель Суперкубка России", years: [2010, 2012], icon: "/images/russia-super-cup.svg"},
    { name: "Двухкратный чемпион России", years: [2008, 2009], icon: "/images/russia-league.svg"},
    { name: "Обладатель Кубка России", years: ["2011/2012"], icon: "/images/russia-cup.svg"},
    { name: "Победитель Первой лиги", years: [2002, 2023], icon: "/images/russia-first-league.svg"},
    { name: "Победитель Кубка Содружества", years: [2010,]},
    { name: "Четверть-финалист Лиги Европы УЕФА", years: ["2012/2013"]},
    { name: "Участник группового этапа Лиги Чемпионов УЕФА", years: [2009, 2010]},
    { name: "Дваждый бронзовый призёр Чемпионата России", years: [2003, 2010]},
]
const AchievementsPage = () => {
    return (
        <div className="page">
            <section className={`${styles.achievements} section`}>
                <div className="section__header">
                    <h1 className="section__title">Достижения</h1>
                </div>
                <div className={`${styles.achievements__body} section__body`}>
                    <div className={styles.achievements__list}>
                        {[achievements.map((achievement, index) => (
                            <div key={achievement.name + index} className={styles.achievement}>
                                <div className={styles.achievement__years}>{ achievement.years.join(", ") }</div>
                                <div className={styles.achievement__content}>
                                    <div className={styles.achievement__name}>{ achievement.name }</div>
                                    <div className={styles.achievement__cup}>
                                        {achievement.icon && <img src={achievement.icon} alt="" /> }
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

export default AchievementsPage