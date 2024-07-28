import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';

import editIcon from "../../images/svg/edit.svg";

const EditProfilePage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/profile")
    }

    return (
        <section className="page">

            <section className="big-card big-card--edit">
                <div className="big-card__cover">
                    <div className="big-card__edit-cover">
                        <img src={editIcon} alt="" />
                        <span>Изменить обложку</span>
                    </div>
                    <img src="/images/profile-cover.png" alt="" />
                </div>
                <div className="big-card__content">
                    <div className="big-card__avatar big-card__avatar--profile">
                        <picture>
                            <img src="/images/profile-avatar.png" alt="" />
                        </picture>
                        <div className="big-card__avatar-status"></div>
                        <div className="big-card__edit-avatar">
                            <img src={editIcon} alt="" />
                        </div>
                    </div>
                    <div className="big-card__info">
                        <div className="big-card__info-header">
                            <div>
                                <h1 className="big-card__title">Иван Иванов</h1>
                                <div className="big-card__level">Уровень <span>0</span></div>
                            </div>
                        </div>
                        <div className="big-card__info-body">
                            <form action="#" method="POST" className="big-card__form" onSubmit={handleSubmit}>
                                <textarea name="" id="" placeholder="Расскажи немног о себе"></textarea>
                                <button className="button button--main" type="submit">
                                    <span>Сохранить изменения</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <Wall type="profile" posts={[]}/>
            </section>

        </section>
    )
}

export default EditProfilePage