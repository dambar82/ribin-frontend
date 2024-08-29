import styles from "./Quizzes.module.scss"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchQuizzes } from "../../store/quizzesSlice"
import { useNavigate } from "react-router-dom"

import questionIcon from "../../images/svg/question.svg"

import Grid from "../../components/Grid/Grid"
import Card from "../../components/Card/Card"

const QuizzesPage = () => {
    
  const quizzes = useAppSelector(state => state.quizzes.quizzes)
    
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [])
    
    return (
        <div className="page">
            <section className={`${styles.hero} hero`}>
                <img src="images/hero-news-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-quizzes-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Викторины</h1>
            </section>
            <section className={""}>
                <div className="section__header">
                    <h2 className="section__title">Все викторины</h2>
                    <div className="section__counter">{quizzes?.length}</div>
                </div>
                <div className="section__body">
                    <Grid totalItems={12}>
                        {quizzes?.map(quiz => (
                            <Card
                                key={quiz.id}
                                name={quiz.title}
                                image={'https://api-rubin.multfilm.tatar/storage/'+quiz.image}
                                buttonLabel="Начать викторину"
                                onClick={() => {
                                  navigate(`/quizzes/${quiz.id}`)
                                  setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 100)
                                }}
                            />
                        ))}
                    </Grid>
                </div>
            </section>
        </div>
    )
}

const getQuastionsWord = ( num: number ) => {
  if (num > 10 && [11, 12, 13, 14].includes(num%100)) return 'вопросов';
  let last_num = num % 10;
  if (last_num == 1) return 'вопрос';
  if ([2,3,4].includes(last_num)) return 'вопроса';
  if ([5,6,7,8,9,0].includes(last_num)) return 'вопросов';
}

export default QuizzesPage