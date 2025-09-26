import axios from 'axios';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        } else if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'An unknown error occurred';
        }
    }
};

export const signup = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { name, email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        } else if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'An unknown error occurred';
        }
    }
};

export const apiCall = async (endpoint: string, method: string, data?: any) => {
    try {
        const response = await axios({
            url: `${API_URL}${endpoint}`,
            method,
            data,
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        } else if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'An unknown error occurred';
        }
    }
};