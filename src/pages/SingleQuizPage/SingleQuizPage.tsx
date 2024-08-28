import { useState } from "react"

import styles from "./SingleQuizPage.module.scss"

import arrowIcon from "../../images/svg/button_arrow.svg"

const SingleQuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [result, setResult] = useState(0)
    const [answer, setAnswer] = useState(null)
    const questions = [
        {
            text: "На какой улице в Казани находится «Ак Барс Арена» - домашний стадион «Рубина»?",
            answers: ["Проспект Победы", "Улица Право-Булачная", "Проспект Хусаина Ямашева", "Улица Тукаевская"],
            rightAnswer: 1,
        },
        {
            text: "Вопрос",
            answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"],
            rightAnswer: 2,
        },
        {
            text: "Вопрос 2",
            answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"],
            rightAnswer: 3,
        },
    ]

    const handleAnswerClick = (index) => {
        let right = questions[currentQuestion - 1].rightAnswer === index;
        if (right) {
            setResult(prevResult => ++prevResult)
        }
        setAnswer(right)
    }

    const changeQuestion = () => {
        setCurrentQuestion(prevState => ++prevState)
        setAnswer(null)
    }

    const handleClick = () => {
        if (currentQuestion === 0) {
            setCurrentQuestion(1)
        } else {
            setCurrentQuestion(0)
        }
    }

    let question = questions[currentQuestion - 1]

    return (
        <div className="page">
            <section className={`section`}>
                <div className="section__header">
                    <h1 className="section__title">История ФК "Рубин"</h1>
                </div>
                <div className="section__body">
                    <div className={styles.quiz}>
                        <div className={styles.quiz__content}>
                            {currentQuestion === questions.length + 1
                                ? 
                                <div className={styles.quiz__result}>
                                    <div>Викторина завершена</div> 
                                    <p>{
                                        result / questions.length < 0.5
                                        ? "Поздравляем с завершением викторины! Вы ответили на несколько вопросов, и это уже хороший старт. Не расстраивайтесь, если не всё получилось, ведь каждый вопрос - это возможность узнать что-то новое."
                                        : result / questions.length < 0.7
                                        ? "Поздравляем! Вы успешно прошли викторину и ответили на значительное количество вопросов. Отличный результат! Вы на верном пути к званию настоящего эксперта!"
                                        : "Поздравляем! Вы отлично справились с викториной и ответили на большинство (или все) вопросов. Потрясающий результат! Вы настоящий знаток. Не забывайте делиться своими достижениями с друзьями и пригласите их принять участие."
                                    }</p>
                                    <div><span>{result}</span>/<span>{questions.length}</span></div>
                                </div>
                                :
                                <>
                                    <div className={styles.quiz__header}>
                                        <button className={`${styles.quiz__backButton} button`} type="button"><span>Назад</span></button>
                                        <div className={styles.quiz__counter}>
                                            Вопросов: { currentQuestion === 0 ? <span>10</span> : <><span>{currentQuestion}</span> из <span>{questions.length}</span></>}</div>
                                    </div>
                                    <div className={styles.quiz__body}>
                                        { currentQuestion === 0 
                                        ? <p className={styles.quiz__invitation}>Готовы проверить свои знания о нашем клубе? Вас ждут увлекательные вопросы о первых шагах, знаменитых победах, великих игроках и незабываемых матчах "Рубина".</p>
                                        :
                                            <div className={styles.quiz__question}>
                                                <p className={styles.quiz__questionText}>{question.text}</p>
                                                { answer !== null
                                                    ?
                                                    <div className={styles.quiz__rightAnswer}>
                                                        <div className={styles.quiz__rightAnswerBody}>
                                                            {answer 
                                                                ? <div className={styles.quiz__rightAnswerResult} data-result="true">Верно</div>
                                                                : <div className={styles.quiz__rightAnswerResult} data-result="false">Неверно</div>
                                                            }
                                                            <p>Правильный ответ: {question.answers[question.rightAnswer]}</p>
                                                        </div>
                                                        <button type="button" onClick={changeQuestion}>Далее</button>
                                                    </div>
                                                    :
                                                    <div className={styles.quiz__questionAnswers}>
                                                        {question.answers.map((answer, index) => (
                                                            <button 
                                                                key={index}
                                                                className={`${styles.quiz__questionAnswer}`}
                                                                onClick={() => handleAnswerClick(index + 1)}
                                                            >{answer}</button>
                                                        ))}
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>      
                                </>
                            }
                        </div>
                        <button className={currentQuestion === 0 ? styles.quiz__button : `${styles.quiz__button} ${styles.quiz__button_outlined}`} onClick={handleClick} type="button">
                            <span>{currentQuestion === 0 ? "Начать викторину" : "Завершить викторину"}</span>
                            {currentQuestion === 0 ? <img src={arrowIcon} alt=""/> : null}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SingleQuizPage