import styles from "./Quizzes.module.scss";

import questionIcon from "../../images/svg/question.svg";

import Grid from "../../components/Grid/Grid";
import Card from "../../components/Card/Card";

const QuizzesPage = () => {
  const quizzes = [
    'История ФК "Рубин"',
    'Знаменитые матчи "Рубина""',
    'Игроки "Рубина": Легенды и Настоящие',
  ];
  return (
    <div className="page">
      <section className={`${styles.hero} hero`}>
        <img
          src="images/hero-news-bg.png"
          className={`${styles.hero__bg} hero__bg`}
          alt=""
        />
        <img
          src="images/hero-quizzes-ruby.png"
          className={`${styles.hero__ruby} hero__ruby`}
          alt=""
        />
        <h1 className={`${styles.hero__title} hero__title`}>Викторины</h1>
      </section>
      <section className={""}>
        <div className="section__header">
          <h2 className="section__title">Все викторины</h2>
          <div className="section__counter">10</div>
        </div>
        <div className="section__body">
          <Grid totalItems={12}>
            {[1, 2, 3, 4].map(() =>
              quizzes.map((quiz, index) => (
                <Card
                  key={quiz + index}
                  name={quiz}
                  image={`/images/quiz-0${index + 1}.png`}
                  tagIcon={questionIcon}
                  tagLabel="10 вопросов"
                  buttonLabel="Начать викторину"
                />
              ))
            )}
          </Grid>
        </div>
      </section>
    </div>
  );
};

export default QuizzesPage;
