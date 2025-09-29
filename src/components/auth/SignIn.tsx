import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';
import AuthBranding from './AuthBranding';
import AuthFormContainer from './AuthFormContainer';

const SignIn: React.FC = () => {
    const { loginUser, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await loginUser(email, password);
        } catch (err) {
            console.error('Login failed');
        }
    };

    const leftContent = (
        <AuthBranding 
            title="AxleXpert"
            subtitle="Your Car, Our Expertise."
        />
    );

    const rightContent = (
        <AuthFormContainer title="Sign In" error={error}>
            <form onSubmit={handleSubmit}>
                <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
                    Email
                </Typography>
                <TextField
                    placeholder="example@email.com"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f1f5f9',
                            '& fieldset': { border: 'none' },
                        }
                    }}
                />

                <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
                    Password
                </Typography>
                <TextField
                    placeholder="At least 8 characters"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f1f5f9',
                            '& fieldset': { border: 'none' },
                        }
                    }}
                />

                <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Typography
                        component="a"
                        href="/forget-password"
                        sx={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                       <Link to="/forget-password"> Forgot Password?</Link>
                    </Typography>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        backgroundColor: '#1e293b',
                        color: 'white',
                        py: 1.2,
                        fontSize: '1rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: 1,
                        mb: 2,
                        '&:hover': {
                            backgroundColor: '#334155'
                        }
                    }}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Don't you have an account?{' '}
                        <Typography
                            component="a"
                            href="/signup"
                            sx={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                fontWeight: 500,
                                fontFamily: 'inherit'
                            }}
                        >
                            Sign up
                        </Typography>
                    </Typography>
                </Box>
            </form>
        </AuthFormContainer>
    );

    return (
        <AuthLayout 
            leftContent={leftContent}
            rightContent={rightContent}
            backgroundImage="/images/signin-bg.png"
        />
    );
};

export default SignIn;