import React from 'react';

import { IUser } from '../utils/interfaces/IUser.interface';


export const ApplicationContext = React.createContext({
    loading: true,
    token: '',
    user: {} as IUser,
    pageContainer: {} as HTMLElement,
    setLoading: (loading: boolean) => {},
    setToken: (token: string) => {},
    setUser: (user: IUser) => {},
    setPageContainer: (pageContainer: HTMLElement) => {}
});
