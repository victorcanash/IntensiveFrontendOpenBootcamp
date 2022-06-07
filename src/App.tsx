import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import { ApplicationContext } from './contexts/ApplicationContext';
import { getCredentials } from './utils/auth';
import { IUser } from './utils/interfaces/IUser.interface';

import { ScrollToTop } from './routes/ScrollToTop';
import { AppRoutes } from './routes/Routes';
import { Loading } from './components/loading/Loading';
import { StickyFooter } from './components/footer/StickyFooter';


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

    const [pageContainer, setPageContainerState] = useState({} as HTMLElement);
    const setPageContainer = (pageContainer: HTMLElement) => {
        setPageContainerState(pageContainer);
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
        <React.Fragment>
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
                                pageContainer, 
                                setLoading, 
                                setToken,
                                setUser,
                                setPageContainer
                            }}
                        >

                            <BrowserRouter>
                                <ScrollToTop>
                                    <AppRoutes />
                                </ScrollToTop>
                            </BrowserRouter>

                            <StickyFooter />

                        </ApplicationContext.Provider>
                    </div> 
            }
        </React.Fragment>
    );
}

export default App;
