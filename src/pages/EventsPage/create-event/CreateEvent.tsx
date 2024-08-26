import { Clubs } from '../../../types'
import c from './createEvent.module.scss'
import { Button, Input, Modal, Textarea } from '../../../shared/UI'
import { ChangeEvent, useRef, useState } from 'react'
import { isFileSizeAllowed } from '../../../shared/utils/validators/isFileSizeAllowed'
import { arrayFromTo, classNames } from '../../../shared/utils'
import { MONTHS } from '../../../shared/constants'
import { getMonth, getYear } from 'date-fns'
import DatePicker, { ReactDatePickerCustomHeaderProps, registerLocale } from 'react-datepicker'
import ru from "date-fns/locale/ru";
import { useAppDispatch } from '../../../store/hooks'
import { createPortal } from 'react-dom'
import { SuccessCreateEvent } from '../success-create-event/SuccessCreateEvent'
import Map from '../../../components/Map/Map'
import { createEvent } from '../../../store/eventsSlice'

//@ts-ignore
registerLocale('ru', ru)

const YEARS = arrayFromTo(1990, getYear(new Date()) + 1);


interface CreateEventProps {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>
}
const CreateEvent = ({ setActiveTab }: CreateEventProps) => {

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

    dispatch(createEvent(data))
      .then((res: any) => {
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

  const loadPhoto = ( e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
    const input = e.currentTarget.querySelector('input')
    input?.click()
  }

  const onLoad = ( e: ChangeEvent<HTMLInputElement> ) => {
    if ( !e.target.files ) return

		const file = e.target.files[0]!

		if ( file.size / 1024 / 1024 >= 2 ) {
      alert('Файл дожен быть не более 2 MB')
      return
    }

    setLoadedPhotos(prev => {
      prev.push({
        file,
        url: URL.createObjectURL(file)
      })
      return [...prev]
    })
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

export { CreateEvent }