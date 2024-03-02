import axios from 'axios';

var apiEngine = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const fetchData = async (url) => {
    const token = localStorage.getItem('token');
    try {
        const response = await apiEngine.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.data) {
            throw new Error('No data received from server');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response.status === 401) {
            localStorage.removeItem('token');
        }
        return null;
    }
};

export const fetchOptions = async (fetchUrl) => {
    const data = await fetchData(fetchUrl)
    return data.map((option) => ({
        value: option.id,
        label: option.name,
    }));
};

export const postData = async (submitURL, data) => {
    const token = localStorage.getItem('token');

    try {
        const response = await apiEngine.post(submitURL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting form:', error);
        if (error.response.status === 401) {
            localStorage.removeItem('token');
        }
        throw new Error('Failed to submit form data');
    }
};