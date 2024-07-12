import React, {useEffect} from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Contests from "./pages/Contests/Contests";
import {useSelector} from "react-redux";
import {RootState} from "./store/store";
import AuthLayout from "./components/layouts/AuthLayout";
import UnauthLayout from "./components/layouts/UnauthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import UsersFilter from "./pages/UsersFilter/UsersFilter";
import RubyLife from "./pages/RubyLife/RubyLife";
import AuthorizedMain from "./pages/AuthorizedMain/AuthorizedMain";
import MainAuthorizedLayout from "./components/layouts/MainAuthorizedLayout";
import SportPage from "./pages/SportPage/SportPage";
import StudentsPage from './pages/StudentsPage/StudentsPage';
import CoachesPage from './pages/CoachesPage/CoachesPage';
import PhotoGalleryPage from './pages/PhotoGalleryPage/PhotoGalleryPage';
import SingleClubPage from './pages/SingleClubPage/SingleClubPage';
import PostsPage from './pages/PostsPage/PostsPage';
import AwardsPage from './pages/AwardsPage/AwardsPage';


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

    const { user } = useSelector((state: RootState) => state.user);

  return (
      <BrowserRouter>
          <Routes>
              <Route
                  path="/login"
                  element={
                      <UnauthLayout>
                          <Login />
                      </UnauthLayout>
                  }
              />
              <Route
                  path="/register"
                  element={
                      <UnauthLayout>
                          <Register />
                      </UnauthLayout>
                  }
              />
              <Route
                path='/restore'
                element={
                  <RestoreLayout>
                      <Restore />
                  </RestoreLayout>
                }
              >
              </Route>
              <Route
                path='/restore/password'
                element={
                  <RestoreLayout>
                      <NewPassword></NewPassword>
                  </RestoreLayout>
                }
              >
              </Route>
              <Route
                path='/'
                element={
                  user ? (
                      <MainAuthorizedLayout>
                          <AuthorizedMain></AuthorizedMain>
                      </MainAuthorizedLayout>
                      ) : (
                      <MainUnauthorizedLayout>
                          <UnauthorizedMain></UnauthorizedMain>
                      </MainUnauthorizedLayout>
                  )
                }
              >

              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/contests"
                      element={
                          <AuthLayout>
                              <Contests />
                          </AuthLayout>
                      }
                  />
                  <Route
                      path="/contests/:contestId"
                      element={
                          <AuthLayout>
                              <ContestPage />
                          </AuthLayout>
                      }
                  />
                  <Route
                      path="/contests/:contestId/form"
                      element={
                          <AuthLayout>
                              <ContestForm />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/people"
                      element={
                          <AuthLayout>
                              <UsersFilter></UsersFilter>
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/"
                      element={
                          <AuthLayout>
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/news"
                      element={
                          <AuthLayout>
                                <NewsPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/blog"
                      element={
                          <AuthLayout>
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/clubs"
                      element={
                          <AuthLayout>
                              <Clubs />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/clubs/:id"
                      element={
                          <AuthLayout>
                              <SingleClubPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/rubylife"
                      element={
                          <AuthLayout>
                              <RubyLife></RubyLife>
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/sportslife"
                      element={
                          <AuthLayout>
                              <SportPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/students"
                      element={
                          <AuthLayout>
                            <StudentsPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/academy-coaches"
                      element={
                          <AuthLayout>
                            <CoachesPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/photogallery"
                      element={
                          <AuthLayout>
                            <PhotoGalleryPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/posts"
                      element={
                          <AuthLayout>
                            <PostsPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route
                      path="/awards"
                      element={
                          <AuthLayout>
                            <AwardsPage />
                          </AuthLayout>
                      }
                  />
              </Route>
              <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
