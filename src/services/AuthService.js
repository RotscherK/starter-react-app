import axios from 'axios';

var apiEngine = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const register = async ({ username, email, password }) => {
    try {
        const response = await apiEngine.post('register', { username, email, password });
        return ['Registration successful:', response.data];
    } catch (error) {
        console.error('Login error:', error.response.data.error);
        return [];
    }
};

export const login = async ({username, password}) => {

    try {
        const response = await apiEngine.post('login', { username, password });
        const token = response.data.token;
        localStorage.setItem('token', token);

        return ['Registration successful:', response.data];
    } catch (error) {
        console.error('Login error:', error.response.data.error);
    }
};

export const checkLoggedInStatus = async () => {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean
};
