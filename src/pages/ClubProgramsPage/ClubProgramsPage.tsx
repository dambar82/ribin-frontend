import styles from "./ClubProgramsPage.module.scss";

const ClubProgramsPage = () => {
  const ages = [
    {
      age: "Возраст (2015 г.р)",
      phone: { value: "+79375288168", label: "8 (937) 528-81-68" },
      coach: "Антон Валерьевич - тренер",
    },
    {
      age: "Возраст (2014 г.р)",
      phone: { value: "+79050252888", label: "8 (905) 025-28-88" },
      coach: "Руслан Леонидович - тренер",
    },
    {
      age: "Возраст (2013 г.р)",
      phone: { value: "+79503203680", label: "8 (950) 320-36-80" },
      coach: "Алексей Олегович - тренер",
    },
    {
      age: "Возраст (2012 г.р)",
      phone: { value: "+79871877897", label: "8 (987) 187-78-97" },
      coach: "Антон Валерьевич - тренер",
    },
    {
      age: "Возраст (2012 г.р)",
      phone: { value: "+79871877897", label: "8 (987) 187-78-97" },
      coach: "Виталий Анатольевич - тренер",
    },
    {
      age: "Возраст (2008 - 2015 г.р)",
      phone: null,
      coach: "Открываем набор для девочек",
    },
  ];

  return (
    <div className="page">
      <section className={`section ${styles.selection}`}>
        <div className="section__header">
          <h2 className="section__title">Программы и предложения</h2>
        </div>
        <div className={`section__body ${styles.selection__body}`}>
          <div className={styles.selection__content}>
            <div className={styles.selection__title}>Отбор в команды</div>
            <div className={styles.selection__desc}>
              Для записи и уточнения информации обращайтесь к тренеру
            </div>

            <div className={styles.selection__contacts}>
              <a
                href="tel:+79050392408"
                className={styles.selection__contactsPhone}
              >
                +7 905 039-24-08
              </a>
              <div className={styles.selection__contactsPerson}>
                Марат Ильдарович - тренер
              </div>
            </div>
          </div>
          <div className={styles.selection__image}>
            <img src="/images/selection.png" alt="" />
          </div>
        </div>
      </section>
      <section className={`section ${styles.views}`}>
        <div className="section__header">
          <h2 className="section__title">
            Просмотры в команды младших возрастов
          </h2>
        </div>
        <div className="section__body">
          <div className={styles.views__row}>
            {ages.map((age, index) => (
              <div key={age.age + index} className={styles.view}>
                <div className={styles.view__age}>{age.age}</div>
                {age.phone && (
                  <a
                    href={`tel:${age.phone.value}`}
                    className={styles.view__phone}
                  >
                    {age.phone.label}
                  </a>
                )}
                <div className={styles.view__coach}>{age.coach}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`section ${styles.footnote}`}>
        <div className="section__body">
          <div className={styles.footnote__content}>
            <div className={styles.footnote__title}>
              Отбор старщших возрастов*
            </div>
            <p className={styles.footnote__desc}>
              Для старших возрастов (от 12 лет) отбор в академию производится
              исключительно по решению тренеров-селекционеров, который лично
              просматривает игры и оценивает игру ребят как на республиканских,
              так и на федеральных футбольных соревнованиях
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClubProgramsPage;
