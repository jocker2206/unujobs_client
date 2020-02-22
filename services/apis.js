import axios from 'axios';
import { API_AUTHENTICATION } from '../env.json';
import Cookies from 'js-cookie';


let headers = {
    Authorization: `Bearer ${Cookies.get('auth_token')}`
};


/**
 *  api para consumir el authenticador
 */
export const authentication = {
    get: (path, config = { headers }) => {
        return axios.get(`${API_AUTHENTICATION}/${path}`, config);
    },
    post: (path, body = {}, config = { headers }) => {
        return axios.post(`${API_AUTHENTICATION}/${path}`, body, config);
    }
};


