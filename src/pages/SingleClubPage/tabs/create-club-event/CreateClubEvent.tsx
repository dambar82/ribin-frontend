import { Clubs } from '../../../../types'
import c from './createClubEvent.module.scss'
import c2 from '../../SingleClubPage.module.scss'
import { Button, Input, Modal, Textarea } from '../../../../shared/UI'
import { ChangeEvent, useRef, useState } from 'react'
import { arrayFromTo, classNames, getResizedImg } from '../../../../shared/utils'
import { MONTHS } from '../../../../shared/constants'
import { getMonth, getYear } from 'date-fns'
import DatePicker, { ReactDatePickerCustomHeaderProps, registerLocale } from 'react-datepicker'
import ru from "date-fns/locale/ru";
import { useAppDispatch } from '../../../../store/hooks'
import { createClubEvent } from '../../../../store/clubsSlice'
import { createPortal } from 'react-dom'
import { SuccessCreateEvent } from '../success-create-event/SuccessCreateEvent'
import Map from '../../../../components/Map/Map'

//@ts-ignore
registerLocale('ru', ru)

const YEARS = arrayFromTo(1990, getYear(new Date()) + 1);
const PHOTO_WIDTH = 1000
const PHOTO_HEIGHT = 1000


interface CreateClubEventProps {
  club: Clubs
  setActiveTab: React.Dispatch<React.SetStateAction<number>>
}
const CreateClubEvent = ({ club, setActiveTab }: CreateClubEventProps) => {

  // const [loadedCover, setLoadedCover] = useState<{ file: Blob, url: string } | null>(null)
  const [loadedPhotos, setLoadedPhotos] = useState<{ file: Blob, url: string }[]>([])
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [activeToggle, setActiveToggle] = useState(false)

  const [activeModal, setActiveModal] = useState<boolean | null>(null)

  const coverRef = useRef<HTMLInputElement>(null)
  const dataPickerEl = useRef(null)
  const timePickerEl = useRef(null)

  const dispatch = useAppDispatch()

  const onSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)

    // if ( loadedCover ) data.set('caption', loadedCover.file, 'caption.png')
      
    loadedPhotos.forEach((photo, i) => {
      data.append('source[]', photo.file, `photo${i+1}.png`)
    })

    const date = `${startDate.getFullYear()}-${('0' + (startDate.getMonth()+1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`
    data.set('date', date)

    const time = `${startDate.getHours()}:${('0' + startDate.getMinutes()).slice(-2)}`
    data.set('time', time)

    data.set('visible', 'all')

    dispatch(createClubEvent({ sendObj: data, club_id: club.id }))
      .then(res => {
        console.log(res);
        if ( !res.payload?.errors && !res.payload?.exception ) {
          setActiveModal(true)
          //@ts-ignore
          setLoadedPhotos([])
          setStartDate(new Date())
          setActiveToggle(false)
        }
      })
  }

  // const onDragOver = ( e: React.DragEvent<HTMLDivElement> ) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  // }

  // const onDrop = ( e: React.DragEvent<HTMLDivElement> ) => {
  //   e.preventDefault()
  //   const file = e.dataTransfer.files[0]

  //   if ( !isFileSizeAllowed(file.size) ) return

  //   setLoadedCover({
  //     file,
  //     url: URL.createObjectURL(file)
  //   })
  // }

  // const loadCover = ( e: ChangeEvent<HTMLInputElement> ) => {
  //   if ( !e.target.files ) return

	// 	const file = e.target.files[0]!

	// 	if ( !isFileSizeAllowed(file.size) ) return

  //   setLoadedCover({
  //     file,
  //     url: URL.createObjectURL(file)
  //   })
  // }

  // const cancelLoadedCover = () => {
  //   setLoadedCover(null)
  // }

  const loadPhoto = ( e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
    const input = e.currentTarget.querySelector('input')
    input?.click()
  }

  const onLoad = ( e: ChangeEvent<HTMLInputElement> ) => {
    
    const file = e.target.files[0]
    
    if ( !file ) return

    const img: HTMLImageElement = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = async () => {
      try {
        const imgWidth = img.width
        const imgHeight = img.height

        const resizedImg: Blob = await getResizedImg({img, newWidth: PHOTO_WIDTH, newHeight: PHOTO_HEIGHT, imgWidth, imgHeight})

        setLoadedPhotos(prev => {
          prev.push({
            file: resizedImg,
            url: URL.createObjectURL(resizedImg)
          })
          return [...prev]
        })
      } catch ( err ) {
        console.log(err)
      }
    }
    
  }

  const deletePhoto = ( url: string ) => {
    setLoadedPhotos(prev => prev.filter(photo => photo.url !== url))
  }

  return (
    <div className='page' >

      {createPortal(
        <SuccessCreateEvent
          active={activeModal}
          setActive={setActiveModal}
          setActiveTab={setActiveTab}
        />
        , document.body
      )}
      
      <div className={c.page_top} >
        <h1>Мероприятие клуба</h1>
        <Button onClick={() => setActiveTab(0)} >Вернуться</Button>
      </div>

      <section className={c.section}>

        <form onSubmit={onSubmit} >

          {/* {loadedCover
          ?
          <div className={c.loaded_cover_wrapper} >
              <img src={loadedCover?.url} />
              <Button onClick={cancelLoadedCover} >Удалить</Button>
            </div>
          :
            <div
              className={c.drop_area}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <input
                accept='.jpg,.jpeg,.png'
                // name='caption'
                type="file"
                ref={coverRef}
                onChange={loadCover}
                className={c.input_caption}
              />
              <svg width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M62.9993 8.33325H25.4993C23.2892 8.33325 21.1696 9.21123 19.6068 10.774C18.044 12.3368 17.166 14.4564 17.166 16.6666V83.3333C17.166 85.5434 18.044 87.663 19.6068 89.2258C21.1696 90.7886 23.2892 91.6666 25.4993 91.6666H75.4993C77.7095 91.6666 79.8291 90.7886 81.3919 89.2258C82.9547 87.663 83.8327 85.5434 83.8327 83.3333V29.1666L62.9993 8.33325Z" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M58.834 8.33325V24.9999C58.834 27.2101 59.712 29.3297 61.2748 30.8925C62.8376 32.4553 64.9572 33.3333 67.1673 33.3333H83.834" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M42.1673 58.3334C46.7697 58.3334 50.5006 54.6025 50.5006 50.0001C50.5006 45.3977 46.7697 41.6667 42.1673 41.6667C37.5649 41.6667 33.834 45.3977 33.834 50.0001C33.834 54.6025 37.5649 58.3334 42.1673 58.3334Z" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M83.8333 70.8333L78.4333 65.4333C76.5502 63.5504 73.9963 62.4927 71.3333 62.4927C68.6704 62.4927 66.1165 63.5504 64.2333 65.4333L38 91.6666" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p>Выберите файл для обложки или перетащите его сюда</p>
              <Button type='button' onClick={() => coverRef.current?.click()} >Выбрать файл(-ы)</Button>
            </div>
          } */}

          <div className={c.photos} >
            <p>Фотографии</p>

            <div className={c.photos_wrapper} >
              <div onClick={loadPhoto} >
                <input
                  accept='.jpg,.jpeg,.png'
                  type="file"
                  onChange={onLoad}
                />
              </div>
              {loadedPhotos.map(photo => (
                <div className={c.loaded_img} >
                  <img
                    key={photo.url}
                    src={photo.url}
                    onClick={() => deletePhoto(photo.url)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={c.fields_wrapper} >

            <div className={c.input_wrapper}>
              <span>Название мероприятия</span>
              <Input
                name='name'
                placeholder='Введите название вашего мероприятия'
              />
            </div>

            <div className={c.date_wrapper} >
              <span>Дата и время</span>
              <div>

                <div className={c.datepicker_wrapper} >
                  {/* @ts-ignore */}
                  <DatePicker
                    locale='ru'
                    renderCustomHeader={(props) => <DatePickerHeader {...props} />}
                    date={startDate}
                    showPopperArrow={false}
                    selected={startDate}
                    //@ts-ignore
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd.MM.YYYY"
                    placeholderText='ММ/ДД/ГГ'
                    withPortal
                    shouldCloseOnSelect={false}
                    className="form-control__field"
                    ref={dataPickerEl}
                  >
                    <button
                      className={classNames('button', 'button--main', c.confirm_button)}
                      type="button"
                      onClick={() => dataPickerEl.current?.setOpen(false)}
                    >
                      <span>Выбрать</span>
                    </button>
                  </DatePicker>
                  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.83203 1.83337V5.50004" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.168 1.83337V5.50004" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.9167 3.66663H5.08333C4.07081 3.66663 3.25 4.48744 3.25 5.49996V18.3333C3.25 19.3458 4.07081 20.1666 5.08333 20.1666H17.9167C18.9292 20.1666 19.75 19.3458 19.75 18.3333V5.49996C19.75 4.48744 18.9292 3.66663 17.9167 3.66663Z" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.25 9.16663H19.75" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                <div className={c.datepicker_wrapper} >
                  {/* @ts-ignore */}
                  <DatePicker
                    locale='ru'
                    date={startDate}
                    showPopperArrow={false}
                    selected={startDate}
                    //@ts-ignore
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="H:mm"
                    withPortal
                    shouldCloseOnSelect={false}
                    className="form-control__field"
                    ref={timePickerEl}
                  >
                    <button
                      className={classNames('button', 'button--main', c.confirm_button)}
                      type="button"
                      onClick={() => timePickerEl.current?.setOpen(false)}
                    >
                      <span>Выбрать</span>
                    </button>
                  </DatePicker>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_4014_3349)"><path d="M11.0007 20.1667C16.0633 20.1667 20.1673 16.0627 20.1673 11C20.1673 5.93743 16.0633 1.83337 11.0007 1.83337C5.93804 1.83337 1.83398 5.93743 1.83398 11C1.83398 16.0627 5.93804 20.1667 11.0007 20.1667Z" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 5.5V11L14.6667 12.8333" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_4014_3349"><rect width="22" height="22" fill="white"/></clipPath></defs></svg>
                </div>

              </div>
            </div>

            <div className={c.input_wrapper}>
              <span>Описание мероприятия</span>
              <Textarea
                name='description'
                placeholder='Укажите цель мероприятия, программу, ключевых спикеров или любую другую важную информацию'
              />
            </div>

            <div className={c.address_wrapper} >
              <div className={c.header} >
                <span>Место проведения</span>
                <div>
                  <span>На карте</span>
                  <button
                    type='button'
                    className={classNames(c.toggle, activeToggle ? c._active : '')}
                    onClick={() => setActiveToggle(prev => !prev)}
                  >
                    <span></span>
                  </button>
                </div>
              </div>

              <div>
                { !activeToggle &&
                  <div className={c.address_input_wrapper} >
                    <Input
                      name='city'
                      placeholder='Укажите город'
                    />
                    <Input
                      name='location'
                      placeholder='Укажите полный адрес проведения мероприятия'
                    />
                  </div>
                }
                {activeToggle &&
                  <MapWrapper coordinates={[55.783063, 49.119782]}></MapWrapper>
                }
              </div>
            </div>

          </div>

          <Button>Создать мероприятие</Button>

        </form>

      </section>

    </div>
  )
}

const DatePickerHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => {

  const [active, setActive] = useState(false)

  return (
    <div className={c.datepicker_header} >
      <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {"<"}
      </button>

      <p onClick={() => setActive(true)} >{MONTHS[getMonth(date)]} {getYear(date)}</p>

      {active && 
        <div className={c.select_wrapper} >
          <select
            value={MONTHS[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(MONTHS.indexOf(value))
            }
          >
            {MONTHS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(+value)}
          >
            {YEARS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type='button' onClick={() => setActive(false)} ></button>
        </div>
      }

      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {">"}
      </button>
    </div>
  )
}

interface MapWrapperProps {
  coordinates: [number, number]
}
const MapWrapper = ({ coordinates }: MapWrapperProps) => {

  const [activeModal, setActiveModal] = useState<boolean | null>(null)

  return <>
    <div className={c.map_wrapper} onClick={() => setActiveModal(true)} >
      <Map coordinates={coordinates}></Map>
    </div>
    <Modal
      active={activeModal}
      setActive={setActiveModal}
      className={c.map_modal}
    >
      <Map coordinates={coordinates}></Map>
    </Modal>
  </>
}

export { CreateClubEvent }