import {useNavigate, useParams} from "react-router-dom";
import styles from "./ProfilePage.module.scss"

import Wall from '../../components/Wall/Wall';

import editIcon from "../../images/svg/edit.svg";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {User} from "../../store/userSlice";
import {editClient, fetchPeople} from "../../store/peopleSlice";
import {useAppDispatch} from "../../store/hooks";
import {isFileSizeAllowed} from "../../shared/utils/validators/isFileSizeAllowed";
import {editClub} from "../../store/clubsSlice";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { id } = useParams();

    const { people, status, error } = useSelector((state: RootState) => state.people)
    const [currentUser, setCurrentUser] = useState<User>(null);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [loadedBanner, setLoadedBanner] = useState<{ file: Blob, url: string } | null>(null)
    const [loadedAvatar, setLoadedAvatar] = useState<{ file: Blob, url: string } | null>(null)

    const bannerRef = useRef<HTMLInputElement>(null)
    const avatarRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        dispatch(fetchPeople());
    }, [dispatch]);

    useEffect(() => {
        setCurrentUser(people.find(user => user.id.toString() === id));
    }, [currentUser, people])
    useEffect(() => {
        if (currentUser) {
            setDescriptionValue(currentUser.description);
        }
    }, [currentUser])

    const loadBanner = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {

        if ( !e.target.files ) return

        const file = e.target.files[0]!

        if ( !isFileSizeAllowed(file.size) ) return

        setLoadedBanner({
            file,
            url: URL.createObjectURL(file)
        })
    }

    const loadAvatar = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {

        if ( !e.target.files ) return

        const file = e.target.files[0]!

        if ( !isFileSizeAllowed(file.size) ) return

        setLoadedAvatar({
            file,
            url: URL.createObjectURL(file)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget)

        if ( loadedAvatar ) {
            data.set('avatar', loadedAvatar.file)
        }

        if ( loadedBanner ) {
            data.set('image', loadedBanner.file)
        }
        data.set('description', descriptionValue);
        data.set('_method', 'put');

        console.log(data);

        dispatch(editClient({
            id: currentUser.id,
            formData: data
        }))

        navigate(`/user/${id}`)
    }

    if (status === 'loading' || !currentUser) {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <section className="page">

            <section className="big-card big-card--edit">
                <div className="big-card__cover">
                    <input
                        accept='.jpg,.jpeg,.png' type="file"
                        ref={bannerRef}
                        onChange={loadBanner}
                        style={{display: 'none'}}
                    />
                    <div className="big-card__edit-cover" onClick={() => bannerRef.current?.click()}>
                        <img src={editIcon} alt="" />
                        <span>Изменить обложку</span>
                    </div>
                    <img src={loadedBanner?.url || currentUser.image} alt="" />
                </div>
                <div className="big-card__content">
                    <div className="big-card__avatar">
                        <picture>
                            <img src={loadedAvatar?.url || currentUser.avatar} alt="" />
                        </picture>
                        <input
                            accept='.jpg,.jpeg,.png' type="file"
                            ref={avatarRef}
                            onChange={loadAvatar}
                            style={{display: 'none'}}
                        />
                        <div className="big-card__avatar-status"></div>
                        <div className="big-card__edit-avatar" onClick={() => avatarRef.current?.click()}>
                            <img src={editIcon} alt="" />
                        </div>
                    </div>
                    <div className="big-card__info">
                        <div className="big-card__info-header">
                            <div>
                                <h1 className="big-card__title">{currentUser.name} {currentUser.surname}</h1>
                                <div className="big-card__level">Уровень <span>{currentUser.level}</span></div>
                            </div>
                        </div>
                        <div className="big-card__info-body">
                            <form className="big-card__form" onSubmit={handleSubmit}>
                                <textarea
                                    name=""
                                    id=""
                                    placeholder="Расскажи немного о себе"
                                    value={descriptionValue}
                                    onChange={(e) => setDescriptionValue(e.target.value)}
                                ></textarea>
                                <button className="button button--main" type="submit">
                                    <span>Сохранить изменения</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                {/*<Wall type="profile" posts={[]}/>*/}
            </section>

        </section>
    )
}

export default EditProfilePage
