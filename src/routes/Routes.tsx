import { Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from '../components/ScrollToTop';
import { HomePage } from '../pages/HomePage';
import { KatasDetailPage } from '../pages/KatasDetailPage';
import { KatasPage } from '../pages/KatasPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';


export const AppRoutes = () => {
    return (
        <ScrollToTop>
            <Routes>
                {/* Routes definition */}
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/register' element={<RegisterPage />}></Route>
                <Route path='/katas' element={<KatasPage />}></Route>
                <Route path='/katas/:id' element={<KatasDetailPage />}></Route>
                {/* Redirecto when Page Not Found */}
                <Route 
                    path='*' 
                    element={<Navigate to='/' replace />}>
                </Route>
            </Routes>
        </ScrollToTop>
    )
}
