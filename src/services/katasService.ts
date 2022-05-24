import { AxiosRequestConfig } from 'axios';

import axios from '../utils/config/axios.config';
import { IKataUpdate, KataLevels } from '../utils/interfaces/IKata.interface';


export const getKataByID = (token: string, id: string) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.get('/katas', options)
}

export const getAllKatas = (token: string, page?: number, limit?: number, level?: KataLevels, order?: {}) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        },
        params: {
            page,
            limit,
            level,
            order
        }
    }
    return axios.get('/katas/all', options)
}

export const createKata = (token: string, kata: IKataUpdate) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        }
    }
    return axios.post('/katas', kata, options);
}

export const updateKata = (token: string, kata: IKataUpdate) => {
    const options: AxiosRequestConfig = {
        headers: {
            'x-access-token': token
        }
    }
    return axios.put('/katas', kata, options);
}
