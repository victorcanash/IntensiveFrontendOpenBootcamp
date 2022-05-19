import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';

import { ApplicationContext } from './contexts/ApplicationContext';
import { getCredentials } from './utils/auth';
import { IUser } from './utils/interfaces/IUser.interface';

import { AppRoutes } from './routes/Routes';
import { Loading } from './components/loading/Loading';
import { StickyFooter } from './components/dashboard/StickyFooter';


function App() {

    const firstRenderRef = useRef(false);

    const [initialized, setInitialized] = useState(false);

    const [loading, setLoadingState] = useState(true);
    const setLoading = (loading: boolean) => {
        setLoadingState(loading);
    };

    const [token, setTokenState] = useState('');
    const setToken = (token: string) => {
        setTokenState(token);
    };

    const [user, setUserState] = useState({} as IUser);
    const setUser = (user: IUser) => {
        setUserState(user);
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true; 
            getCredentials().then((response: {token: string, user: IUser}) => {
                setToken(response.token);
                setUser(response.user);
                setInitialized(true);
            });   
        }    
    }, []);

    return (
        <>
            {
                loading && 
                    <Loading />
            }

            {
                initialized &&
                    <div className="App">
                        <ApplicationContext.Provider
                            value={{ 
                                loading, 
                                token,
                                user, 
                                setLoading, 
                                setToken,
                                setUser 
                            }}
                        >
                            <Router>
                                <AppRoutes />
                            </Router>
                            <StickyFooter />
                        </ApplicationContext.Provider>
                    </div> 
            }
        </>
    );
}

export default App;
