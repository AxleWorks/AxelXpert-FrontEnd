import { useState } from 'react';
import { login, signup } from '../services/api';

interface User {
    email: string;
    id: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(email, password);
            setUser(response.data || response);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    const signupUser = async (email: string, password: string, name?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await signup(name || '', email, password);
            setUser(response.data || response);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, signupUser, user, loading, error };
};

export default useAuth;