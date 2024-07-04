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

// Функция для форматирования даты в желаемый вид
export function formatDate(date) {
    // Форматируем дату в формат 'dd.mm.yyyy hh:mm:ss'
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

export function formatDateToDayMonth(date) {
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
}

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
                      <AuthLayout>
                          dfdf
                      </AuthLayout>
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
                              <NewsPage></NewsPage>
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
                              <Clubs></Clubs>
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
