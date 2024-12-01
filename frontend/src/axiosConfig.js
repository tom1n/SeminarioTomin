import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL base de tu backend
});

export default api;
