import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { getLoggedUser } from '../services/authService';
import { IUser } from '../utils/interfaces/IUser.interface';
import STORAGE_KEYS from '../constants/storageKeys';
import { getLocalStorageItem } from './storage';


export const getCredentials = async (): Promise<{token: string, user: IUser}> => {
    const result = { token: '', user: {} as IUser };
    const token = await getLocalStorageItem(STORAGE_KEYS.JWTToken);
    if (token) {
        await getLoggedUser(token).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.OK) {
                result.token = token;
                result.user = response.data.user;
            }
            return result;
        });
    }   
    return result;
};