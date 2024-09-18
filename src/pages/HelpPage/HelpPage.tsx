
import { Accordion } from '../../shared/UI'
import c from './HelpPage.module.scss'

import help_page_main_page_people from '../../images/help_page_main_page_people.png'
import help_page_main_page_people_sort from '../../images/help_page_main_page_people_sort.png'
import help_page_main_page_people_school_number from '../../images/help_page_main_page_people_school_number.png'
import help_page_main_page_people_results from '../../images/help_page_main_page_people_results.png'

const PEOPLE_LIST = [
  {
    title: 'Поиск',
    text: <p>Введите имя и фамилию пользователя для быстрого нахождения конкретного пользователя.</p>,
    img: help_page_main_page_people
  },
  {
    title: 'Сортировка по:',
    text: <ul style={{ display: 'grid', gap: '16px' }} >
      <li>Активности: Выбирайте пользователей по их активности на сайте.</li>
      <li>Рейтингу: Сортируйте пользователей по их рейтингу (количество лайков, комментариев и побед в конкурсах).</li>
      <li>Популярности: Находите пользователей по количеству друзей.</li>
    </ul>,
    img: help_page_main_page_people_sort
  },
  {
    title: 'Номер школы',
    text: <p>Введите номер школы, чтобы найти всех пользователей, которые там учатся.</p>,
    img: help_page_main_page_people_school_number
  },
  {
    title: 'Результаты',
    text: <p>После выбора нужных фильтров у вас появится список всех доступных пользователей, подходящих под ваш запрос.</p>,
    img: help_page_main_page_people_results
  },
]

const HelpPage = () => {
  return (
    <div className="page" >
      <section className="section">

            <div className="section__header">
                <div className="section__title">Помощь</div>
            </div>

            <div className={c.section_body} >
              <Accordion
                className={c.accordion}
                accordion={[
                  {
                    title: 'Главная страница',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Пользователи',
                    body: <>
                      <p>В этом разделе вы можете найти друзей через фильтр. Используйте поиск для нахождения знакомых и новых друзей по интересам.</p>
                      <ul className={c.elem_list} >
                          {PEOPLE_LIST.map((elem, i) => (
                            <li key={i} >
                              <span>{i+1}</span>
                              <b>{elem.title}</b>
                              <p>{elem.text}</p>
                              <img src={elem.img} />
                            </li>
                          ))}
                      </ul>
                    </>
                  },
                  {
                    title: 'Конкурсы',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Новости',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Записи',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Клубы',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Жизнь “Рубина”',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Активности клуба',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                  {
                    title: 'Личный профиль',
                    body: <>
                      <p></p>
                      <ul className={c.elem_list} >
                        
                      </ul>
                    </>
                  },
                ]}
              />
            </div>

        </section>
    </div>
  )
}

export { HelpPage }