import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ApplicationContext } from '../context/ApplicationContext';


export const useCustomNav = (to: string): void => {
    const navigate = useNavigate();
    const { loading, setLoading } = useContext(ApplicationContext);
    if (!loading) {
        setLoading(true);
    }
    navigate(to);
}
