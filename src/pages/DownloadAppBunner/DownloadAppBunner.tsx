
import { Link } from 'react-router-dom'
import c from './downloadAppBunner.module.scss'

//@ts-ignore
import Phone from '../../images/download-app-phone.png'

const DownloadAppBunner = () => {
  return (
    <div className={c.page_body} >
      
      <div className={c.text_wrapper} >
        <h1>Скачай мобильное приложение FС Rubin AR</h1>
        <p>Мобильное приложение FC Rubin AR необходимо, чтобы сделать взаимодействие со «Спортивным дневником школьника» ещё более захватывающим. Его можно скачать с помощью App Store, Google Play и RuStore. Благодаря приложению становится доступна технология дополненной реальности. Нужно зайти в него, затем открыть камеру смартфона или планшета и навести её на страницы печатного дневника. На экране появится 3D-изображение, которое можно рассмотреть с разных сторон. </p>
        <div className={c.btns} >
          <Link to='/' >
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" fill="white"/><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" stroke="white" stroke-width="3"/><g clip-path="url(#clip0_2819_23836)"><path d="M32.1387 30.1983L29.7504 27.85L20.9829 36.4958L32.1387 30.1983ZM32.1387 23.8058L20.9829 17.5083L29.7504 26.1542L32.1387 23.8058ZM35.6345 28.1892C36.3495 27.6308 36.3495 26.3725 35.587 25.8142L33.247 24.4825L30.6362 27.0025L33.247 29.5225L35.6345 28.1892ZM18.6937 37L28.8887 26.9983L18.6937 17.0008V17C18.1779 17.2658 17.832 17.75 17.832 18.3792V35.6208C17.832 36.25 18.1779 36.7342 18.6937 37Z" fill="#91172C"/></g><defs><clipPath id="clip0_2819_23836"><rect width="20" height="20" fill="white" transform="translate(17 17)"/></clipPath></defs></svg>
            Скачать в Google Play
          </Link>
          <Link to='/' >
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" fill="white"/><rect x="1.5" y="1.5" width="51" height="51" rx="25.5" stroke="white" stroke-width="3"/><g clip-path="url(#clip0_2819_23845)"><path d="M30.4035 19.5603C31.7336 17.969 31.6108 16.5197 31.5723 16C30.398 16.0688 29.0386 16.8058 28.2649 17.7142C27.4124 18.6867 26.911 19.8903 27.0183 21.2452C28.2888 21.3442 29.4483 20.686 30.4035 19.5603Z" fill="#91172C"/><path d="M17.832 27.862C17.832 29.149 18.0658 30.4791 18.5333 31.8504C19.1566 33.6526 21.407 38.0736 23.7546 38.0003C24.982 37.971 25.8492 37.1212 27.4469 37.1212C28.9961 37.1212 29.8 38.0003 31.1677 38.0003C33.5345 37.9655 35.5714 33.9486 36.1654 32.141C32.99 30.6331 33.1605 27.7199 33.1605 27.6273H33.1587C33.1495 25.8251 33.958 24.4639 35.5943 23.462C34.6785 22.1411 33.2962 21.4132 31.4693 21.2711C29.7404 21.1336 27.8503 22.2877 27.1591 22.2877C26.4285 22.2877 24.7519 21.3206 23.4384 21.3206C20.7195 21.3628 17.832 23.5051 17.832 27.862Z" fill="#91172C"/></g><defs><clipPath id="clip0_2819_23845"><rect width="22" height="22" fill="white" transform="translate(16 16)"/></clipPath></defs></svg>
            Скачать в App Store
          </Link>
        </div>
      </div>

      <div className={c.phone_wrapper} >
        <img src={Phone} />
      </div>

    </div>
  )
}

export { DownloadAppBunner }