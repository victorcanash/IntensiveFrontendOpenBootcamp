import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import { AppRoutes } from './routes/Routes';
import { StickyFooter } from './components/dashboard/StickyFooter';
import { Loading } from './components/Loading';
import { ApplicationContext } from './contexts/ApplicationContext';


function App() {

    const [loading, setLoadingState] = useState(true);

    const setLoading = (loading: boolean) => {
        setLoadingState(loading);
    }

    return (
        <>
            {
                loading ? 
                    <Loading /> :
                    null
            }
            <div className="App">
                <ApplicationContext.Provider
                    value={{ loading, setLoading }}
                >
                    <Router>
                        <AppRoutes />
                    </Router>
                    <StickyFooter />
                </ApplicationContext.Provider>
            </div>
        </>
    );
}

export default App;
