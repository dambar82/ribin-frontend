import React, {useEffect} from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Contests from "./pages/Contests/Contests";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store/store";
import AuthLayout from "./components/layouts/AuthLayout";
import UnauthLayout from "./components/layouts/UnauthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register/Register";
import PrivateRoute from "./components/layouts/PrivateRoute";
import Restore from "./pages/Restore";
import RestoreLayout from "./components/layouts/RestoreLayout";
import NewPassword from "./pages/NewPassword";
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

function App() {

    const user = useSelector((state: RootState) => state.user.user);

    const dispatch = useDispatch<AppDispatch>()

    const publicRoutes = [
        { path: '/login', element: <Login />, layout: UnauthLayout },
        { path: '/register', element: <Register />, layout: UnauthLayout },
        { path: '/restore', element: <Restore />, layout: RestoreLayout },
        { path: '/restore/password', element: <NewPassword />, layout: RestoreLayout },
    ];

    const privateRoutes = [
        { path: '/contests', element: <Contests /> },
        { path: '/contests/:contestId', element: <ContestPage /> },
        { path: '/contests/:contestId/form', element: <ContestForm /> },
        { path: '/people', element: <UsersFilter /> },
        { path: '/quizzes', element: <QuizzesPage /> },
        { path: '/quizzes/:id', element: <SingleQuizPage /> },
        { path: '/news', element: <NewsPage /> },
        { path: '/news/:id', element: <SingleNewsPage /> },
        { path: '/profile', element: <ProfilePage /> },
        { path: '/profile/edit', element: <EditProfilePage /> },
        { path: '/user', element: <UserProfilePage /> },
        { path: '/feedback', element: <FeedbackPage /> },
        { path: '/settings', element: <SettingsPage /> },
        { path: '/clubs', element: <Clubs /> },
        { path: '/clubs/:id', element: <SingleClubPage /> },
        { path: '/rubylife', element: <RubyLife /> },
        { path: '/sportslife', element: <SportPage /> },
        { path: '/students', element: <StudentsPage /> },
        { path: '/academy-coaches', element: <CoachesPage /> },
        { path: '/photogallery', element: <PhotoGalleryPage /> },
        { path: '/photogallery/:id', element: <SinglePhotoGalleryPage /> },
        { path: '/posts', element: <PostsPage /> },
        { path: '/awards', element: <AwardsPage /> },
        { path: '/programs', element: <ClubProgramsPage /> },
        { path: '/events', element: <EventsPage /> },
        { path: '/events/event', element: <SingleEventPage /> },
        { path: '/clubs/events/new', element: <CreateEventPage /> },
    ];

    useEffect(() => {
      dispatch(checkAuth())
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map(({ path, element, layout: Layout }) => (
                    <Route key={path} path={path} element={<Layout>{element}</Layout>} />
                ))}
                <Route
                    path="/"
                    element={
                        user ? (
                            <MainAuthorizedLayout>
                                <AuthorizedMain />
                            </MainAuthorizedLayout>
                        ) : (
                            <MainUnauthorizedLayout>
                                <UnauthorizedMain />
                            </MainUnauthorizedLayout>
                        )
                    }
                />
                {privateRoutes.map(({ path, element }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <PrivateRoute>
                                <AuthLayout>{element}</AuthLayout>
                            </PrivateRoute>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
