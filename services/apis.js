import axios from 'axios';

export const unujobs = async (method, path, body) => {
    await axios[method](`http://localhost:8000/api/v1/${path}`, body);
};