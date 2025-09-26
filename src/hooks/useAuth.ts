import { useState } from 'react';
import { loginUser, signupUser } from '../services/api';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginUser(email, password);
            setUser(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await signupUser(email, password);
            setUser(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return { user, error, loading, login, signup, logout };
};

export default useAuth;