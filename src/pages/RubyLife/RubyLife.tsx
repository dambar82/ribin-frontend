import React from 'react';
import styles from './RubyLife.module.scss';
import programImage from '../../images/programImage.jpg';

const RubyLife = () => {
    return (
        <div className={`page`}>
            <div className={`${styles.hero} hero`}>
                <img src="images/hero-rubylife-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-rubylife.svg" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>ЖИЗНЬ</h1>
                <h1 className={`${styles.hero__title_2} hero__title`}>Клуба “Рубин”</h1>
            </div>
            <div className={`section`}>
                <div className='section__header'>
                    <div className='section__title'>Актуальные новости клуба</div>
                    <div className='section__counter'>2303</div>
                </div>
                <div className='section__body'>

                </div>
            </div>
            <div className={`section`}>
                <div className='section__header'>
                    <div className='section__title'>Программы и предложения клуба</div>
                    <div className='section__counter'>5</div>
                </div>
                <div className='section__body'>
                    <div className={styles.programs}>
                        <div className={styles.programs_menuWrapper}>
                            <div className={styles.programs_menu}>
                                <div className={`${styles.programs_menu_item} ${styles.programs_menu_item_active}`}>
                                    7-8 лет
                                </div>
                                <div className={styles.programs_menu_item}>
                                    8-10 лет
                                </div>
                                <div className={styles.programs_menu_item}>
                                    10-12 лет
                                </div>
                                <div className={styles.programs_menu_item}>
                                    12-14 лет
                                </div>
                                <div className={styles.programs_menu_item}>
                                    Индивидуальные тренировки
                                </div>
                            </div>
                        </div>
                        <div className={styles.programs_content}>
                            <div className={styles.programs_content_left}>
                                <div className={styles.programs_content_up}>
                                    <h1>
                                        Вводный курс для новичков
                                    </h1>
                                    <p>
                                        Этот курс предназначен для детей, которые только начинают заниматься футболом. Основное внимание уделяется основам техники, правилам игры и базовой физической подготовке.
                                    </p>
                                    <div className={styles.programs_content_buttons}>

                                    </div>
                                </div>
                            </div>
                            <div className={styles.programs_content_image}>
                                <img src={programImage} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubyLife;