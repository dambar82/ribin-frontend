
export type TQuiz = {
  id: number
  title: string
  image: string
  questions: TQuizQuestion[]
}

export type TQuizQuestion = {
  id: number
  text_question: string
  image: string | null
  answers: { id: number, text_answer: string, correct_answer: 1 | 0 }[]
}


export type TFetchQuizzesResponse = {
  data: TQuiz[]
}

export type TGetQuizByIdResponse = {
  data: TQuiz
}

export type TSendQuizResultRequest = {
  result: number
}
export type TSendQuizResultResponse = {
  data: {
    message: string
  }
}