import { Navigate, useRoutes } from 'react-router-dom';

import { Navigation } from '../components/navigation/Navigation';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { KatasPage } from '../pages/KatasPage';
import { KatasDetailPage } from '../pages/KatasDetailPage';


export const AppRoutes = () => {

    return useRoutes([
        { path: "/", element: <Navigation page={<HomePage />} /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/katas", element: <Navigation page={<KatasPage />} /> },
        { path: "/katas/:id", element: <Navigation page={<KatasDetailPage />} /> },
        { path: "*", element: <Navigate to='/' replace /> },
    ]);
}
