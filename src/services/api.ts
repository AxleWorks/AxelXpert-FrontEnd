import axios from 'axios';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const signup = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};