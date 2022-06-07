import { Navigate, useRoutes } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Navigation } from '../components/navigation/Navigation';
import { HomePage } from '../pages/HomePage';
import { SettingsPage } from '../pages/SettingsPage';
import { UsersPage } from '../pages/UsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { KatasPage } from '../pages/KatasPage';
import { KataDetailPage } from '../pages/KataDetailPage';
import { NewKataPage } from '../pages/NewKataPage';


export const AppRoutes = () => {

    return useRoutes([
        /* Auth */
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },

        /* Home */
        { path: "/", element: <Navigation page={<HomePage />} /> },

        /* Settings */
        { path: "/settings", element: <Navigation page={<SettingsPage />} /> },

        /* All users */
        { path: "/users", element: <Navigation page={<UsersPage />} /> },
        /* User detail with userId param */
        { path: "/users/:id", element: <Navigation page={<UserDetailPage />} /> },

        /* All katas */
        { path: "/katas", element: <Navigation page={<KatasPage />} /> },
        /* Kata detail with kataId param */
        { path: "/katas/:id", element: <Navigation page={<KataDetailPage />} /> },
        /* Create new kata*/
        { path: "/katas/new", element: <Navigation page={<NewKataPage />} /> },

        /* Another route redirect to home */
        { path: "*", element: <Navigate to='/' replace /> },
    ]);
}
