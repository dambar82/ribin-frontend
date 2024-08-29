import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { getQuizById, sendQuizResult } from "../../store/quizzesSlice"
import { TQuiz } from "../../shared/types/quiz.types"
import { Button } from "../../shared/UI"
import { classNames } from "../../shared/utils"

import c from "./SingleQuizPage.module.scss"
import { Alert } from "@mui/material"


type TAnswer = TQuiz['questions'][number]['answers'][number]


const SingleQuizPage = () => {

  const quiz = useAppSelector(state => state.quizzes.quiz)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ id: number, answer: boolean }[]>([])
  const [result, setResult] = useState<{ correct_answers: number, incorrect_answers: number } | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useAppDispatch()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setAnswers(quiz?.questions?.reduce<{ id: number, answer: boolean }[]>((acc, question) => {
      acc.push({ id: question.id, answer: null })
      return acc
    }, []) || [])
  }, [quiz])

  useEffect(() => {
    if ( params.id ) {
      dispatch(getQuizById(params.id))
    }
  }, [params])

  const changeQuestion = ( direction: number ) => {

    if ( currentQuestion === quiz.questions.length && direction ) {
      setResult(answers.reduce((acc, el) => {
        if ( el.answer ) ++acc.correct_answers;
        else ++acc.incorrect_answers;
        return acc
      }, { correct_answers: 0, incorrect_answers: 0 }))
      setCurrentQuestion(0)
      return
    }

    setCurrentQuestion(prev => {
      prev += direction
      return prev
    })
  }

  const finishQuiz = () => {
    dispatch(sendQuizResult({
      sendObj: { result: result.correct_answers },
      quiz_id: quiz.id
    }))
    .then(() => {
      setSuccessMessage('Ваши результаты успешно сохранены')
    })
  }

  if ( !quiz ) return <></>

  return (
    <div className="page">
      <section className={`section`}>
        <div className="section__header">
          <h1 className="section__title">{quiz.title}</h1>
        </div>
        <div className="section__body">

            {!result && currentQuestion === 0 &&
              <StartQuiz
                quiz={quiz}
                changeQuestion={changeQuestion}
              />
            }

            {!result && currentQuestion > 0 &&
              <Question
                quiz={quiz}
                currentQuestion={currentQuestion}
                answers={answers}
                changeQuestion={changeQuestion}
                setAnswers={setAnswers}
                finishQuiz={finishQuiz}
              />
            }

            {result !== null &&
              <QuizResult
                questionsCount={quiz.questions.length}
                result={result}
                finishQuiz={finishQuiz}
                successMessage={successMessage}
              />
            }

        </div>
      </section>
    </div>
  )
}

interface StartQuizProps {
  quiz: TQuiz
  changeQuestion: ( direction: number ) => void
}
const StartQuiz = ({ quiz, changeQuestion }: StartQuizProps) => {
  return (
    <div className={c.quiz}>

      <div className={c.quiz_content} >

        <div className={c.top} >
          {/* <button
            className={c.button}
            onClick={() => navigate(-1)}
          >
            Выйти
          </button> */}
          <div className={c.quiz_counter}>
            Вопросов: {quiz.questions.length}
          </div>
        </div>

        <div className={c.quiz_body}>
          <p>Готовы проверить свои знания о нашем клубе? Вас ждут увлекательные вопросы о первых шагах, знаменитых победах, великих игроках и незабываемых матчах "Рубина".</p>
        </div>

      </div>

      <Button
        className={c.next_button}
        onClick={() => changeQuestion(1)}
      >
        <span>Начать викторину</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 8H14M8 1L15 8L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
     </Button>

    </div>
  )
}


interface QuestionProps {
  quiz: TQuiz
  currentQuestion: number
  answers: {id:number;answer:boolean;}[]
  changeQuestion: ( direction: number ) => void
  setAnswers: React.Dispatch<React.SetStateAction<{id:number;answer:boolean;}[]>>
  finishQuiz: () => void
}
const Question = ({ quiz, currentQuestion, answers, changeQuestion, setAnswers, finishQuiz }: QuestionProps) => {

  const question = quiz.questions?.[currentQuestion-1]

  const [rightAnswer] = useState<TAnswer>(question.answers.find(el => el.correct_answer))
  const [result, setResult] = useState<{id:number;answer:boolean;}|null>(null)

  useEffect(() => {
    setResult(answers.find(el => el.id === question.id))
  }, [answers, question])

  if ( !question ) {
    return <QuestionError changeQuestion={changeQuestion} finishQuiz={finishQuiz} />
  }

  const chooseAnswer = ( answer: TAnswer ) => {
    setAnswers(prev => {
      prev[currentQuestion-1].answer = !!answer.correct_answer
      return [...prev]
    })
  }

  return (
    <div className={c.quiz}>

      <div className={c.quiz_content} >

        <div className={c.top} >
          {/* <button
            className={c.button}
            onClick={() => changeQuestion(-1)}
          >
            Назад
          </button> */}
          <div className={c.quiz_counter}>
            Вопрос: {currentQuestion} из {quiz.questions.length}
          </div>
        </div>

        <div className={c.question_body}>
          <p>{question.text_question}</p>

          {result && result.answer === null &&
            <div className={c.answers} >
              {question.answers.map(answer => (
                <button key={answer.id} onClick={() => chooseAnswer(answer)} >
                  {answer.text_answer}
                </button>
              ))}
            </div>
          }

          {result && result.answer &&
            <CorrectAnswer
              textAnswer={rightAnswer.text_answer}
              changeQuestion={changeQuestion}
            />
          }

          {result && result.answer === false &&
            <InCorrectAnswer
              textAnswer={rightAnswer.text_answer}
              changeQuestion={changeQuestion}
            />
          }

        </div>

      </div>

      {/* <Button
        className={c.end_button}
        onClick={finishQuiz}
      >
        <span>Завершить викторину</span>
     </Button> */}

    </div>
  )
}

interface CorrectAnswerProps {
  textAnswer: string
  changeQuestion: ( direction: number ) => void
}
const CorrectAnswer = ({ textAnswer, changeQuestion }: CorrectAnswerProps) => {
  return (
    <div className={classNames(c.result, c.correct)} >
      <div>
        <span>Верно</span>
        <p>Правильный ответ: {textAnswer}</p>
      </div>
      <button
        className={c.button}
        onClick={() => changeQuestion(1)}
      >
        Далее
      </button>
    </div>
  )
}

interface IncorrectAnswerProps {
  textAnswer: string
  changeQuestion: ( direction: number ) => void
}
const InCorrectAnswer = ({ textAnswer, changeQuestion }: IncorrectAnswerProps) => {
  return (
    <div className={classNames(c.result, c.incorrect)} >
      <div>
        <span>Неверно</span>
        <p>Правильный ответ: {textAnswer}</p>
      </div>
      <button
        className={c.button}
        onClick={() => changeQuestion(1)}
      >
        Далее
      </button>
    </div>
  )
}

interface QuestionErrorProps {
  changeQuestion: ( direction: number ) => void
  finishQuiz: () => void
}
const QuestionError = ({ changeQuestion, finishQuiz }: QuestionErrorProps) => {
  return (
    <div className={c.quiz}>

      <div className={c.quiz_content} >

        <div className={c.top} >
          <button
            className={c.button}
            onClick={() => changeQuestion(-1)}
          >
            Назад
          </button>
        </div>

      </div>

      <Button
        className={c.next_button}
        onClick={finishQuiz}
      >
        <span>Завершить викторину</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 8H14M8 1L15 8L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
     </Button>

    </div>
  )
}


interface QuizResultProps {
  questionsCount: number
  result: { correct_answers: number, incorrect_answers: number }
  successMessage: string
  finishQuiz: () => void
}
const QuizResult = ({ result, questionsCount, successMessage, finishQuiz }: QuizResultProps) => {

  let text = 'Поздравляем! Вы отлично справились с викториной и ответили на большинство (или все) вопросов. Потрясающий результат! Вы настоящий знаток. Не забывайте делиться своими достижениями с друзьями и пригласите их принять участие.'

  if ( result.correct_answers / questionsCount < 0.5 ) {
    text = 'Поздравляем с завершением викторины! Вы ответили на несколько вопросов, и это уже хороший старт. Не расстраивайтесь, если не всё получилось, ведь каждый вопрос - это возможность узнать что-то новое.'
  }
  else if ( result.correct_answers / questionsCount < 0.7 ) {
    text = 'Поздравляем! Вы успешно прошли викторину и ответили на значительное количество вопросов. Отличный результат! Вы на верном пути к званию настоящего эксперта!'
  }

  return (
    <div className={c.quiz} >

      <div className={classNames(c.quiz_content, c.quiz_result)} >
        <b>Викторина завершена!</b>
        <p>{text}</p>
        <div>
          {result.correct_answers}/{questionsCount}
        </div>
      </div>

      {successMessage
      ?
        <div className={c.success_message} >{successMessage}</div>
      :
        <Button
          className={c.end_button}
          onClick={finishQuiz}
        >
          <span>Завершить викторину</span>
        </Button>
     }

    </div>
  )
}


export default SingleQuizPage