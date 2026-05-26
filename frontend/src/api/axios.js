import axios from 'axios';

const $host = axios.create({
    baseURL: 'http://localhost:3001/api' // порт бэкенда!!!!
});

$host.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

export default $host;
