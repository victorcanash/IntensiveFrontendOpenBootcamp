import { AxiosRequestConfig } from 'axios';

import axios from '../utils/config/axios.config';
import { KataLevel } from '../utils/interfaces/IKata.interface';


export const getAllKatas = (token: string, page?: number, limit?: number, level?: KataLevel, order?: {}) => {

    // http://localhost:8000/api/katas?limit=1&page=1
    // Add headers with JWT in x-access-token
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
    return axios.get('/katas', options)

}

export const getKataByID = (token: string, id: string) => {
    // http://localhost:8000/api/katas?id=XXXXXXXXXXXX
    // Add headers with JWT in x-access-token
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
