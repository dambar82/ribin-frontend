import React, {useEffect, useState} from 'react';
import styles from './Contests.module.scss';
import contestImg from '../../images/contestImg.jpg'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {fetchContests} from "../../store/contestSlice";
import ContestCard from "../../components/ContestCard/ContestCard";
import plusSVG from '../../images/svg/plus.svg';
import minusSVG from '../../images/svg/minus.svg'
import {Link} from "react-router-dom";
import { classNames } from '../../shared/utils'

interface IFaq {
    question: string;
    answer: string;
}

const faqs: IFaq[] = [
    {
        question: 'Каковы критерии оценки работ?',
        answer: 'Оценка работ осуществляется по следующим критериям:  оригинальность, техническое мастерство, соответствие теме и т. д.'
    },
    {
        question: 'Могу ли я участвовать, если не соответствую возрастным ограничениям?',
        answer: 'Оценка работ осуществляется по следующим критериям:  оригинальность, техническое мастерство, соответствие теме и т. д.'
    },
    {
        question: 'Что делать, если у меня возникли проблемы с регистрацией/отправкой работ/получением приза и т. д.?',
        answer: 'Оценка работ осуществляется по следующим критериям:  оригинальность, техническое мастерство, соответствие теме и т. д.'
    },
    {
        question: 'Как узнать о результатах конкурса и когда они будут объявлены?',
        answer: 'Оценка работ осуществляется по следующим критериям:  оригинальность, техническое мастерство, соответствие теме и т. д.'
    },
    {
        question: 'Могу ли я участвовать, если не являюсь жителем определенной страны или региона?',
        answer: 'Оценка работ осуществляется по следующим критериям:  оригинальность, техническое мастерство, соответствие теме и т. д.'
    },
    {
        question: 'Могу ли я редактировать свою заявку после отправки?',
        answer: 'Оценка работ осуществляется по следующим критериям:  оригинальность, техническое мастерство, соответствие теме и т. д.'
    },
]

const Contests = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { contests, contestStatus, error } = useSelector((state: RootState) => state.contests);

    const [openQuestions, setOpenQuestions] = useState<Record<number, boolean>>({});

    const toggleQuestion = (index: number) => {
        setOpenQuestions(prev => ({ ...prev, [index]: !prev[index] }));
    };

    useEffect(() => {
        console.log(contests)
    }, [contests])

    useEffect(() => {
        if (contestStatus === 'idle') {
            dispatch(fetchContests());
        }
    }, [contestStatus, dispatch]);

    if (contestStatus === 'loading') {
        return <p>Loading...</p>;
    }

    if (contestStatus === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div className='page'>
            <div className={classNames('image', styles.image)}>
                <img src={contestImg} alt=""/>
            </div>
            <div className='content_after_image'>
                <div className={`${styles.contests_header} justify_content_SB`}>
                    <h2>
                        Все конкурсы
                    </h2>
                    <div className={styles.counter}>
                        {contests.length}
                    </div>
                </div>
                <div className={styles.contest_list}>
                    {contests.map((contest) => (
                        // contest.status === 1 ? (
                            <Link to={`/contests/${contest.id}`} key={contest.id}>
                                <ContestCard
                                    title={contest.name}
                                    image={contest.source}
                                    status={contest.status}
                                    short_description={contest.short_description}
                                    start_date={contest.start_date}
                                    end_date={contest.end_date}
                                />
                            </Link>
                        // ) : (
                        //     <ContestCard
                        //         key={contest.id}
                        //         title={contest.name}
                        //         image={contest.source}
                        //         status={contest.status}
                        //         short_description={contest.short_description}
                        //         start_date={contest.start_date}
                        //         end_date={contest.end_date}
                        //     />
                        // )
                    ))}
                </div>
            </div>
            {/*<div className='content_after_image'>*/}
            {/*    <div className={`${styles.contests_header}`}>*/}
            {/*        <h2>*/}
            {/*            Часто задаваемые вопросы*/}
            {/*        </h2>*/}
            {/*    </div>*/}
            {/*    <div className={styles.faq}>*/}
            {/*        {faqs.map((faq, index) => (*/}
            {/*            <div key={index} className={styles.faq_question}>*/}
            {/*                <div className='justify_content_SB'>*/}
            {/*                    <p>{faq.question}</p>*/}
            {/*                    <img*/}
            {/*                        src={openQuestions[index] ? minusSVG : plusSVG}*/}
            {/*                        alt={openQuestions[index] ? 'Минус' : 'Плюс'}*/}
            {/*                        onClick={() => toggleQuestion(index)}*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*                {openQuestions[index] && (*/}
            {/*                    <div className={styles.faq_hiddenAnswer}>*/}
            {/*                        {faq.answer}*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default Contests;
