import React, {useEffect, useState} from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Contests from "./pages/Contests/Contests";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store/store";
import AuthLayout from "./components/layouts/AuthLayout";
import UnauthLayout from "./components/layouts/UnauthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PrivateRoute from "./components/layouts/PrivateRoute";
import Restore from "./pages/Auth/Restore";
import RestoreLayout from "./components/layouts/RestoreLayout";
import NewPassword from "./pages/Auth/NewPassword";
import ContestPage from "./pages/ContestPage/ContestPage";
import ContestForm from "./pages/ContestForm/ContestForm";
import MainUnauthorizedLayout from "./components/layouts/MainUnauthorizedLayout";
import UnauthorizedMain from "./pages/UnauthorizedMain/UnauthorizedMain";
import Clubs from "./pages/Clubs/Clubs";
import NewsPage from "./pages/NewsPage/NewsPage";
import SingleNewsPage from './pages/SingleNewsPage/SingleNewsPage';
import UsersFilter from "./pages/UsersFilter/UsersFilter";
import RubyLife from "./pages/RubyLife/RubyLife";
import AuthorizedMain from "./pages/AuthorizedMain/AuthorizedMain";
import MainAuthorizedLayout from "./components/layouts/MainAuthorizedLayout";
import SportPage from "./pages/SportPage/SportPage";
import StudentsPage from './pages/StudentsPage/StudentsPage';
import CoachesPage from './pages/CoachesPage/CoachesPage';
import PhotoGalleryPage from './pages/PhotoGalleryPage/PhotoGalleryPage';
import SinglePhotoGalleryPage from './pages/SinglePhotoGalleryPage/SinglePhotoGalleryPage';
import SingleClubPage from './pages/SingleClubPage/SingleClubPage';
import PostsPage from './pages/PostsPage/PostsPage';
import AwardsPage from './pages/AwardsPage/AwardsPage';
import ClubProgramsPage from './pages/ClubProgramsPage/ClubProgramsPage';
import QuizzesPage from './pages/QuizzesPage/QuizzesPage';
import SingleQuizPage from './pages/SingleQuizPage/SingleQuizPage';
import CreateEventPage from './pages/EventsPage/CreateEventPage';
import EventsPage from './pages/EventsPage/EventsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditProfilePage from './pages/ProfilePage/EditProfilePage';
import UserProfilePage from './pages/ProfilePage/UserProfilePage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import SingleEventPage from './pages/SingleEventPage/SingleEventPage';
import { checkAuth } from './store/userSlice'
import { ConfirmEmailModal } from './pages/Auth/components'
import { Loader } from './shared/UI'
import MainPage from './pages/Main/MainPage'
import SingleNewsPageApi from "./pages/SingleNewsPageApi/SingleNewsPageApi";
import Chat from "./components/Chat/Chat";
import Pusher from 'pusher-js';
import Page from "./pages/Page/Page";
import AchievementsPage from "./pages/AchievementsPage/AchievementsPage";
import { DownloadAppBunner } from './pages/DownloadAppBunner/DownloadAppBunner'
import UnauthLayoutRegister from './components/layouts/UnauthLayoutRegister';
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import NotificationFriends from "./components/Notification/NotificationFriends";
import { HelpPage } from './pages/HelpPage/HelpPage'
import BalanceHistory from "./pages/BalanceHistory/BalanceHistory";
import ScrollToTop from "./components/ScrollToTop";


export function postFormatDate(isoString) {
    const date = new Date(isoString);

    // Получаем компоненты даты
    const day = String(date.getDate()).padStart(2, '0'); // День
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц (месяцы начинаются с 0)
    const year = date.getFullYear(); // Год

    // Получаем компоненты времени
    const hours = String(date.getHours()).padStart(2, '0'); // Часы
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Минуты

    // Форматируем строку
    return `${day}.${month}.${year} I ${hours}:${minutes}`;
}

export function parseAndFormatDate(input) {
    // Разбиваем строку на части
    const parts = input.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (parts) {
        // Перестраиваем в формат, совместимый с Date
        const isoString = `${parts[3]}-${parts[2]}-${parts[1]}T${parts[4]}:${parts[5]}:${parts[6]}.000Z`;
        return new Date(isoString);
    } else {
        throw new Error('Неверный формат даты');
    }
}

export function formatDateToDayMonth(date) {
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
}

export const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const months = {
        "01": "января",
        "02": "февраля",
        "03": "марта",
        "04": "апреля",
        "05": "мая",
        "06": "июня",
        "07": "июля",
        "08": "августа",
        "09": "сентября",
        "10": "октября",
        "11": "ноября",
        "12": "декабря"
    };
    //@ts-ignore
    return `${parseInt(day)} ${months[month]}`;
};

const pusher = new Pusher('05817bdeb548cb607678', {
    cluster: 'mt1',
});

function App() {

    const user = useSelector((state: RootState) => state.user.user);

    const isAuth = !!user?.email_confirmed

    const [loading, setLoading] = useState(false);
    const [notificationFriend, setNotificationFriend] = useState({visible: false, data: null});
    const [autoCloseTimeout, setAutoCloseTimeout] = React.useState<NodeJS.Timeout | null>(null);

    const dispatch = useDispatch<AppDispatch>()

    const otherLayouts = [
        { path: '/login', element: <Login />, layout: UnauthLayoutRegister },
        { path: '/register', element: <Register />, layout: UnauthLayoutRegister },
        { path: '/restore', element: <Restore />, layout: RestoreLayout },
        { path: '/restore/password/:token', element: <NewPassword />, layout: RestoreLayout },
        { path: '/', element: <MainPage/>, layout: MainAuthorizedLayout },
    ]

    const publicRoutes = [
        { path: '/email-confirmation/:hash', element: <ConfirmEmailModal email='' user_id={0} />, layout: UnauthLayout },
        { path: '/contests', element: <Contests />, layout: UnauthLayout },
        { path: '/contests/:contestId', element: <ContestPage />, layout: UnauthLayout },
        { path: '/news', element: <NewsPage />, layout: UnauthLayout },
        { path: '/news/:id', element: <SingleNewsPage />, layout: UnauthLayout },
        {path: '/news/api/:id', element: <SingleNewsPageApi/>, layout: UnauthLayout },
        { path: '/people', element: <UsersFilter />, layout: UnauthLayout },
        { path: '/clubs', element: <Clubs />, layout: UnauthLayout },
        { path: '/rubylife', element: <RubyLife />, layout: UnauthLayout },
        { path: '/sportslife', element: <SportPage />, layout: UnauthLayout },
        { path: '/photogallery', element: <PhotoGalleryPage />, layout: UnauthLayout  },
        { path: '/photogallery/:id', element: <SinglePhotoGalleryPage />, layout: UnauthLayout },
        { path: '/students', element: <StudentsPage /> , layout: UnauthLayout },
        { path: '/academy-coaches', element: <CoachesPage /> , layout: UnauthLayout },
        { path: '/achievements', element: <AwardsPage /> , layout: UnauthLayout },
        { path: '/awards', element: <AchievementsPage/>, layout: UnauthLayout},
        { path: '/programs', element: <ClubProgramsPage /> , layout: UnauthLayout },
        { path: '/page/:url', element: <Page/>, layout: UnauthLayout },
        { path: '/download-app', element: <DownloadAppBunner /> },
        { path: '/help', element: <HelpPage />, layout: UnauthLayout },
        { path: '/events', element: <EventsPage />, layout: UnauthLayout },
        { path: '/posts', element: <PostsPage />, layout: UnauthLayout },
        { path: '/user/:id', element: <UserProfilePage />, layout: UnauthLayout },
    ];

    const privateRoutes = [
        { path: '/contests/:contestId/form', element: <ContestForm /> },
        { path: '/quizzes', element: <QuizzesPage /> },
        { path: '/quizzes/:id', element: <SingleQuizPage /> },
        { path: '/clubs/:id', element: <SingleClubPage /> },
        { path: '/user/:id/edit/', element: <EditProfilePage /> },
        { path: '/feedback', element: <FeedbackPage /> },
        { path: '/settings', element: <SettingsPage /> },
        { path: '/chat/:userId', element: <Chat/>},
        { path: '/events/event/:id', element: <SingleEventPage /> },
        { path: '/clubs/events/new', element: <CreateEventPage /> },
        { path: '/user/:id/friends', element: <FriendsPage />},
        { path: '/balance-history', element: <BalanceHistory/> }
    ];

    let token;

    try {
        const storedToken = localStorage.getItem('token');
        token = JSON.parse(storedToken);

        // Проверка, если токена нет, просто присваиваем его значение null
        if (storedToken === null) {
            token = null; // Токен отсутствует
        }
    } catch (error) {
        console.error('Ошибка при получении токена:', error);
    }

    useEffect(() => {
      if ( token ) {
        setLoading(true)
        dispatch(checkAuth())
          .finally(() => {
            setLoading(false)
          })
      }
    }, [])

    useEffect(() => {
        if (isAuth) {
            const channelName = `notification.${user.id}`;
            const channel = pusher.subscribe(channelName);

            channel.bind('friendship.add_friend', (data) => {
                console.log(data);
                if (data) {
                    setNotificationFriend({ visible: true, data });

                    // Через 2 секунды скрываем уведомление
                    const timeout = setTimeout(() => {
                        setNotificationFriend({ visible: false, data: data });
                    }, 8000);

                    setAutoCloseTimeout(timeout);
                }
            })

            channel.bind('friendship.friend_request_accepted', (data) => {
                console.log(data);
            })
        }
    }, [isAuth])

    // if ( token && (loading || !user) ) {
    //   return <Loader />
    // }

    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                {publicRoutes.map(({ path, element, layout }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <UnauthLayout
                                notificationFriend={notificationFriend}
                                setNotificationFriend={setNotificationFriend}
                                autoCloseTimeout={autoCloseTimeout}
                                setAutoCloseTimeout={setAutoCloseTimeout}
                            >
                                {element}
                            </UnauthLayout>
                    }
                    />
                ))}
                {otherLayouts.map(({path, element, layout: Layout}) => (
                        <Route key={path} path={path} element={Layout ? <Layout>{element}</Layout> : element} />
                ))}
                {/*<Route*/}
                {/*    path="/"*/}
                {/*    element={*/}
                {/*      <MainAuthorizedLayout>*/}
                {/*        <MainPage />*/}
                {/*      </MainAuthorizedLayout>*/}
                {/*    }*/}
                {/*/>*/}
                {privateRoutes.map(({ path, element }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <PrivateRoute>
                                <AuthLayout notificationFriend={notificationFriend} setNotificationFriend={setNotificationFriend} autoCloseTimeout={autoCloseTimeout} setAutoCloseTimeout={setAutoCloseTimeout}>
                                    {element}
                                </AuthLayout>
                            </PrivateRoute>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate to={isAuth ? '/' : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
