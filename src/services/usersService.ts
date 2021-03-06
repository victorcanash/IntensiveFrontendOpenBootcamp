import { AxiosRequestConfig } from 'axios';

import axios from '../utils/config/axios.config';
import { KataLevels } from '../utils/interfaces/IKata.interface';


export const getUserById = (token: string, id: string) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.get('/users', options)
}

export const getAllKatasById = (token: string, id: string, page?: number, limit?: number, level?: KataLevels, order?: {}) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        },
        params: {
            id,
            page,
            limit,
            level,
            order
        }
    }
    return axios.get('/katas/all', options)
};
