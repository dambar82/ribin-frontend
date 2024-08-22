import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { Link, useNavigate } from 'react-router-dom';

import styles from './Clubs.module.scss';

import Grid from '../../components/Grid/Grid'
import ClubCard from '../../components/ClubCard/ClubCard';

import { createClub, fetchClubs } from '../../store/clubsSlice';
import { Modal } from '../../shared/UI'

const Clubs = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { clubs, status, error } = useSelector((state: RootState) => state.clubs);

    const [activeModal, setActiveModal] = useState(false)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchClubs());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    console.log(clubs);
    

    return (
        <div className='page'>
            <div className={`${styles.hero} hero`}>
                <img src="images/hero-clubs-bg.png" className={`${styles.hero__bg} hero__bg`} alt="" />
                <img src="images/hero-clubs-ruby.png" className={`${styles.hero__ruby} hero__ruby`}alt="" />
                <h1 className={`${styles.hero__title} hero__title`}>Клубы</h1>
            </div>
            <div className={`section ${styles.clubs}`}>
                <div className='section__header'>
                    <h2 className='section__title'>Лучшие клубы</h2>
                </div>
                <div className='section__body'>
                    <div className={styles.clubs__row}>
                        {clubs.slice(0, 3).map((club, index) => (
                            <Link to={`/clubs/${club.id}`} key={club.name + index}>
                                <ClubCard
                                    id={club.id}
                                    name={club.name}
                                    image={club.caption}
                                    desc={club.short_description}
                                    participants={club.clients_count}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <article className={styles.article}>
                <img src="images/article-bg.png" alt="" />
                <div className={styles.article__content}>
                    <h3 className={styles.article__slogan}>Создай клуб своей мечты! Преврати свои идеи в реальность и объединяй людей с такими же интересами.</h3>
                    <button
                      className={`${styles.article__button} button button--white`}
                      type='button'
                      onClick={() => setActiveModal(true)}
                    >
                      <span>Создать свой клуб</span>
                    </button>
                    <ClubModal
                      active={activeModal}
                      setActive={setActiveModal}
                    />
                </div>
            </article>
            <div className={`section ${styles.clubs}`}>
                <div className='section__header'>
                    <h2 className='section__title'>Все клубы</h2>
                    <div className='section__counter'>2303</div>
                </div>
                <div className='section__body'>
                    <Grid totalItems={clubs.length}>
                        {clubs.map((club, index) => (
                            <ClubCard
                                id={club.id}
                                key={club.name + index}
                                name={club.name}
                                image={club.caption}
                                desc={club.short_description}
                                participants={club.clients_count}
                            />
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
};



interface ClubModalProps {
  active: boolean | null
  setActive: React.Dispatch<React.SetStateAction<boolean | null>>
}
const ClubModal = ({ active, setActive }: ClubModalProps) => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)

    const name = data.get('name') as string | null
    const description = data.get('description') as string | null

    if ( description.length > 120 ) {
      alert('Описание должно быть не более 120 символов')
      return
    }

    dispatch(createClub({
      name,
      description
    }))
    .then(({ payload }) => {
      if ( !payload.id ) return
      setActive(false)
      setTimeout(() => {
        navigate(`/clubs/${payload.id}`)
      }, 100);
    })
  }

  return (
    <Modal
      active={active}
      setActive={setActive}
      className={styles.create_club_modal}
    >
      <form onSubmit={onSubmit} >
        <div className="form-control">
          <div className="form-control__label">Название клуба</div>
          <input
            name='name'
            className="form-control__field"
            type="text" 
            placeholder='Введите название вашего клуба'
            autoComplete="off"
          />
        </div>
        <div className="form-control">
          <div className="form-control__label">Описание клуба</div>
          <textarea
            name='description'
            className="form-control__field"
            placeholder='Опишите деятельность клуба'
            rows={5}
          />
        </div>
        <button>Создать клуб</button>
      </form>
    </Modal>
  )
}

export default Clubs;