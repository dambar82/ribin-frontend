import styles from "./page404.module.scss";
import { Link } from "react-router-dom";
import img from "../../images/404.svg";

const Page404 = () => {
  return (
    <div className={styles.page404}>
      <section>
        <h1 className={styles.page404_heading}>404</h1>
        <img src={img} alt="" className={styles.page404_image} />
      </section>
      <div>
        <p className={styles.page404_info}>
          Похоже, что искомая страница недоступна. Проверьте правильность
          введенного адреса или перейдите на главную страницу.
        </p>
        <Link to={"/"} className={styles.page404_link}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default Page404;
