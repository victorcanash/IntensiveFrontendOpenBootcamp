import React from 'react';


export const ApplicationContext = React.createContext({
    loading: true,
    setLoading: (loading: boolean) => {},
});
