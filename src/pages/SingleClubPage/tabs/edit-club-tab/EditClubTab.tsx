
import c from './editClubTab.module.scss'
import c2 from '../../SingleClubPage.module.scss'

import geoIcon from '../../../../images/svg/geo.svg'
//@ts-ignore
import banner from '../../../../images/default_club_banner.png'
//@ts-ignore
import avatar from '../../../../images/default_club_avatar.png'
import { Clubs } from '../../../../types'
import { Button, Input } from '../../../../shared/UI'
import { ChangeEvent, useRef, useState } from 'react'
import { classNames } from '../../../../shared/utils'
import { isFileSizeAllowed } from '../../../../shared/utils/validators/isFileSizeAllowed'
import { TEditClubRequest } from '../../../../shared/types/club.types'
import { useAppDispatch } from '../../../../store/hooks'
import { editClub } from '../../../../store/clubsSlice'
import Row from '../../../../components/Row/Row'
import Card from '../../../../components/Card/Card'



interface EditClubTabProps {
  club: Clubs
  setActiveTab: React.Dispatch<React.SetStateAction<number>>
}
const EditClubTab = ({ club, setActiveTab }: EditClubTabProps) => {

  const [loadedBanner, setLoadedBanner] = useState<{ file: Blob, url: string } | null>(null)
  const [loadedAvatar, setLoadedAvatar] = useState<{ file: Blob, url: string } | null>(null)

  const dispatch = useAppDispatch()

  const bannerRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const saveChanges = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)

    if ( loadedAvatar ) data.set('source', loadedAvatar.file, 'source')
    if ( loadedBanner ) data.set('caption', loadedBanner.file, 'caption')

    dispatch(editClub({
      id: club.id,
      formData: data
    }))
  }

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
  
  const createEvent = () => {
    setActiveTab(2)
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 100)
  }
  
  return (
    <div className='page' >

      <section className={classNames('section', c2.clubInfo, c.club_info_section)}>
        <div className={classNames(c2.clubInfo__image, c.banner_wrapper)}>
            <img src={loadedBanner?.url || club.caption || banner} />
            <div className={c.button_wrapper} >
              <input
                accept='.jpg,.jpeg,.png' type="file"
                ref={bannerRef}
                onChange={loadBanner}
              />
              <button onClick={() => bannerRef.current?.click()} >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.1739 4.81189C19.7026 4.28332 19.9997 3.56636 19.9998 2.81875C19.9999 2.07113 19.703 1.3541 19.1744 0.825393C18.6459 0.296684 17.9289 -0.000394485 17.1813 -0.000488259C16.4337 -0.000582033 15.7166 0.296316 15.1879 0.824893L1.84193 14.1739C1.60975 14.4054 1.43805 14.6904 1.34193 15.0039L0.0209344 19.3559C-0.00491027 19.4424 -0.00686216 19.5342 0.0152856 19.6217C0.0374333 19.7092 0.0828547 19.7891 0.146731 19.8529C0.210607 19.9167 0.290555 19.962 0.378093 19.984C0.465631 20.006 0.557494 20.0039 0.643935 19.9779L4.99693 18.6579C5.3101 18.5626 5.59511 18.392 5.82693 18.1609L19.1739 4.81189Z" fill="white"/></svg>
                Изменить обложку
              </button>
            </div>
        </div>
        <div className={classNames(c2.clubInfo__content, c.club_info_content)}>

            <div className={classNames(c2.clubInfo__avatar, c.club_info_avatar)}>
                <div>
                  <img src={loadedAvatar?.url || club.caption || avatar} alt="" />
                  <div className={c.button_wrapper} >
                    <input
                      accept='.jpg,.jpeg,.png' type="file"
                      ref={avatarRef}
                      onChange={loadAvatar}
                    />
                    <button onClick={() => avatarRef.current?.click()} >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.1739 4.81189C19.7026 4.28332 19.9997 3.56636 19.9998 2.81875C19.9999 2.07113 19.703 1.3541 19.1744 0.825393C18.6459 0.296684 17.9289 -0.000394485 17.1813 -0.000488259C16.4337 -0.000582033 15.7166 0.296316 15.1879 0.824893L1.84193 14.1739C1.60975 14.4054 1.43805 14.6904 1.34193 15.0039L0.0209344 19.3559C-0.00491027 19.4424 -0.00686216 19.5342 0.0152856 19.6217C0.0374333 19.7092 0.0828547 19.7891 0.146731 19.8529C0.210607 19.9167 0.290555 19.962 0.378093 19.984C0.465631 20.006 0.557494 20.0039 0.643935 19.9779L4.99693 18.6579C5.3101 18.5626 5.59511 18.392 5.82693 18.1609L19.1739 4.81189Z" fill="white"/></svg>
                    </button>
                  </div>
                </div>
            </div>

            <div className={c.club_info}>

                <form onSubmit={saveChanges} >
                  <div className={c.input_wrapper}>
                    <span>Название клуба</span>
                    <Input
                      name='name'
                      placeholder={club.name}
                    />
                  </div>

                  <div className={c.input_wrapper}>
                    <span>Описание клуба</span>
                    <Input
                      name='description'
                      placeholder={club.description}
                    />
                  </div>

                  <Button type='submit' >Сохранить изменения</Button>
                </form>

                <Button onClick={() => setActiveTab(0)} >Вернуться</Button>
            </div>

        </div>
      </section>

      <section className="section">
        <div className='section__header'>
            <h2 className='section__title'>Мероприятия клуба</h2>
            <div className='section__counter'>{club.events?.length}</div>
        </div>
        <div className='section__body'>
          <Row>

            <div className={c.create_club_event} onClick={createEvent} >
              <span>Создать новое мероприятие</span>
            </div>

            {(club.events?.length <= 1) &&
              <div className={classNames(c.create_club_event, c.disabled)} >
                <span>Создать новое мероприятие</span>
              </div>
            }
            {(club.events?.length === 0) &&
              <div className={classNames(c.create_club_event, c.disabled)} >
                <span>Создать новое мероприятие</span>
              </div>
            }

            {club.events?.map(event => (
              <Card
                key={event.id}
                date={`${event.date}, ${event.time}`}
                name={event.name}
                image={event.caption}
                desc={event.description}
                tagIcon={geoIcon}
                tagLabel={`${event.city} ${event.location}`}
              />
            ))}

          </Row>
        </div>
      </section>

    </div>
  )
}

export { EditClubTab }