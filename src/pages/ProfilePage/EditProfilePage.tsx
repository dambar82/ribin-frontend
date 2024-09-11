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
import {editClub} from "../../store/clubsSlice";
import { getResizedImg } from "../../shared/utils"


const BANNER_WIDTH = 2000
const BANNER_HEIGHT = 400
const AVATAR_WIDTH = 512
const AVATAR_HEIGHT = 512


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

        const file = e.target.files[0]

        if ( !file ) return

        const img: HTMLImageElement = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = async () => {
          try {
            const imgWidth = img.width
            const imgHeight = img.height

            const resizedImg: Blob = await getResizedImg({img, newWidth: BANNER_WIDTH, newHeight: BANNER_HEIGHT, imgWidth, imgHeight})

            setLoadedBanner({
              file: resizedImg,
              url: URL.createObjectURL(resizedImg)
            })
          } catch ( err ) {
            console.log(err)
          }
        }
    }

    const loadAvatar = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {

        if ( !e.target.files ) return

        const file = e.target.files[0]

        if ( !file ) return

        const img: HTMLImageElement = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = async () => {
          try {
            const imgWidth = img.width
            const imgHeight = img.height

            const resizedImg: Blob = await getResizedImg({img, newWidth: AVATAR_WIDTH, newHeight: AVATAR_HEIGHT, imgWidth, imgHeight})

            setLoadedAvatar({
              file: resizedImg,
              url: URL.createObjectURL(resizedImg)
            })
          } catch ( err ) {
            console.log(err)
          }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget)

        if ( loadedAvatar ) {
            data.set('avatar', loadedAvatar.file, 'avatar.png')
        }

        if ( loadedBanner ) {
            data.set('image', loadedBanner.file, 'image.png')
        }
        data.set('description', descriptionValue);
        data.set('_method', 'put');

       // console.log(data);

       await dispatch(editClient({
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
                                <div className="big-card__level">Рубиков <span>{currentUser.rubick}</span></div>
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
