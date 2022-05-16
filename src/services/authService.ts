import { AxiosRequestConfig } from 'axios';

import axios from '../utils/config/axios.config';
import { IAuthLogin, IAuthRegister } from '../utils/interfaces/IAuth.interface';


/**
 * Login Method
 * @param {IAuthLogin} authLogin IAuthLogin interface to send all required data in the body
 * @returns 
 */
export const login = (authLogin: IAuthLogin) => {
    return axios.post('/auth/login', authLogin);
}

/**
 * Register Method
 * @param {IAuthRegister} authRegister IAuthRegister interface to send all required data in the body
 * @returns 
 */
export const register = (authRegister: IAuthRegister) => {
    return axios.post('/auth/register', authRegister);
}

/**
 * Logout Method
 * @returns 
 */
 export const logout = (token: string) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        }
    }
    return axios.post('/auth/logout', undefined, options);
}

/**
 * Logout Method
 * @returns 
 */
 export const getLoggedUser = (token: string) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        }
    }
    return axios.get('/auth/me', options);
}
