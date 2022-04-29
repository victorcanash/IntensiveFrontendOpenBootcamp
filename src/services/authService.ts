import axios from '../utils/config/axios.config';
import { IAuthLogin, IAuthRegister } from '../utils/interfaces/IAuth.interface';


/**
 * Login Method
 * @param {IAuthLogin} authLogin IAuthLogin interface to send all required data in the body
 * @returns 
 */
export const login = (authLogin: IAuthLogin) => {
    // Send POST request to login endpoint
    // http://localhost:8000/api/auth/login
    return axios.post('/auth/login', authLogin)
}

/**
 * Register Method
 * @param {IAuthRegister} authRegister IAuthRegister interface to send all required data in the body
 * @returns 
 */
export const register = (authRegister: IAuthRegister) => {
    // Send POST request to register endpoint
    // http://localhost:8000/api/auth/register
    return axios.post('/auth/register', authRegister)
}
