import React, { useEffect } from 'react';
import LoginComponent from '../components/auth/SignIn';

const Login = () => {
    useEffect(() => {
        // Remove all default margins/padding and set full width/height
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
        
        // Also remove any default styling from the root element
        const root = document.getElementById('root');
        if (root) {
            root.style.margin = '0';
            root.style.padding = '0';
            root.style.width = '100vw';
            root.style.height = '100vh';
        }
        
        // Cleanup function to restore defaults when component unmounts
        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.documentElement.style.margin = '';
            document.documentElement.style.padding = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            if (root) {
                root.style.margin = '';
                root.style.padding = '';
                root.style.width = '';
                root.style.height = '';
            }
        };
    }, []);

    return <LoginComponent />;
};

export default Login;
