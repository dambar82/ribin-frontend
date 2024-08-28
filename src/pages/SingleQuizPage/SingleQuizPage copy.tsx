import { useEffect, useState } from "react"

import styles from "./SingleQuizPage.module.scss"

import arrowIcon from "../../images/svg/button_arrow.svg"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { getQuizById } from "../../store/quizzesSlice"
import { useParams } from "react-router-dom"

const SingleQuizPage = () => {

  const quiz = useAppSelector(state => state.quizzes.quiz)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [result, setResult] = useState(0)
  const [answer, setAnswer] = useState(null)

  const dispatch = useAppDispatch()
  const params = useParams()

  useEffect(() => {
    if ( params.id ) {
      dispatch(getQuizById(params.id))
    }
  }, [params])

  const handleAnswerClick = (index) => {
      // let right = quiz.questions[currentQuestion - 1].rightAnswer === index;
      // if (right) {
      //     setResult(prevResult => ++prevResult)
      // }
      // setAnswer(right)
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

  if ( !quiz ) return <></>

  let question = quiz.questions?.[currentQuestion - 1]

    return (
        <div className="page">
            <section className={`section`}>
                <div className="section__header">
                    <h1 className="section__title">{quiz.title}</h1>
                </div>
                <div className="section__body">
                    <div className={styles.quiz}>
                        <div className={styles.quiz__content}>
                            {currentQuestion === quiz.questions?.length + 1
                                ? 
                                <div className={styles.quiz__result}>
                                    <div>Викторина завершена</div> 
                                    <p>{
                                        result / quiz.questions?.length < 0.5
                                        ? "Поздравляем с завершением викторины! Вы ответили на несколько вопросов, и это уже хороший старт. Не расстраивайтесь, если не всё получилось, ведь каждый вопрос - это возможность узнать что-то новое."
                                        : result / quiz.questions?.length < 0.7
                                        ? "Поздравляем! Вы успешно прошли викторину и ответили на значительное количество вопросов. Отличный результат! Вы на верном пути к званию настоящего эксперта!"
                                        : "Поздравляем! Вы отлично справились с викториной и ответили на большинство (или все) вопросов. Потрясающий результат! Вы настоящий знаток. Не забывайте делиться своими достижениями с друзьями и пригласите их принять участие."
                                    }</p>
                                    <div><span>{result}</span>/<span>{quiz.questions?.length}</span></div>
                                </div>
                                :
                                <>
                                    <div className={styles.quiz__header}>
                                        <button className={`${styles.quiz__backButton} button`} type="button"><span>Назад</span></button>
                                        <div className={styles.quiz__counter}>
                                            Вопросов: { currentQuestion === 0 ? <span>{quiz.questions?.length}</span> : <><span>{currentQuestion}</span> из <span>{quiz.questions.length}</span></>}</div>
                                    </div>
                                    <div className={styles.quiz__body}>
                                        { currentQuestion === 0 
                                        ? <p className={styles.quiz__invitation}>Готовы проверить свои знания о нашем клубе? Вас ждут увлекательные вопросы о первых шагах, знаменитых победах, великих игроках и незабываемых матчах "Рубина".</p>
                                        :
                                            <div className={styles.quiz__question}>
                                                <p className={styles.quiz__questionText}>текст</p>
                                                { answer !== null
                                                    ?
                                                    <div className={styles.quiz__rightAnswer}>
                                                        <div className={styles.quiz__rightAnswerBody}>
                                                            {answer 
                                                                ? <div className={styles.quiz__rightAnswerResult} data-result="true">Верно</div>
                                                                : <div className={styles.quiz__rightAnswerResult} data-result="false">Неверно</div>
                                                            }
                                                            <p>Правильный ответ: Ответ</p>
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
                                                            >Ответ</button>
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