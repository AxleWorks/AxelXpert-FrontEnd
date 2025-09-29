import React, { useEffect } from 'react';
import LoginComponent from '../components/auth/SignIn';

const Login = () => {
    useEffect(() => {
        // Keep margins/paddings consistent but avoid locking viewport sizes or hiding overflow
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        const root = document.getElementById('root');
        if (root) {
            root.style.margin = '0';
            root.style.padding = '0';
        }

        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.documentElement.style.margin = '';
            document.documentElement.style.padding = '';
            if (root) {
                root.style.margin = '';
                root.style.padding = '';
            }
        };
    }, []);

    return <LoginComponent />;
};

export default Login;
