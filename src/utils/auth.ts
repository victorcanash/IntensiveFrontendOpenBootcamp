import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { getLoggedUser } from '../services/authService';
import { IUser } from '../utils/interfaces/IUser.interface';
import { getLocalStorageItem, removeLocalStorageItem } from './storage';
import STORAGE_KEYS from '../constants/storageKeys';


export const getCredentials = async (): Promise<{token: string, user: IUser}> => {
    const result = { token: '', user: {} as IUser };
    const token = await getLocalStorageItem(STORAGE_KEYS.JWTToken);
    if (token) {
        await getLoggedUser(token).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.OK && response.data?.user) {
                result.token = token;
                result.user = response.data.user;
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
            console.error(`[Get Logged User ERROR]: ${responseMsg}`);
            /* if (error.response?.status === StatusCodes.UNAUTHORIZED || error.response?.status === StatusCodes.NOT_FOUND) {
                removeLocalStorageItem(STORAGE_KEYS.JWTToken);
            }*/
            removeLocalStorageItem(STORAGE_KEYS.JWTToken);
        });
    }   
    return result;
};