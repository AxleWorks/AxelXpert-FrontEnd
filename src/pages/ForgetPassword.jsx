import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import AuthBranding from '../components/auth/AuthBranding';
import AuthFormContainer from '../components/auth/AuthFormContainer';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    const leftContent = (
        <AuthBranding
            title="AxleXpert"
            subtitle="We've Got You Back!"
        />
    );

    const rightContent = (
        <AuthFormContainer title="Forgot Password?" error={null}>
            {submitted ? (
                <Typography sx={{ fontSize: '16px', textAlign: 'center', mt: 2 }}>
                    If an account exists for this email, you’ll receive a password reset link.
                </Typography>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Typography sx={{ mb: 1, color: '#64748b', fontSize: '16px' }}>
                        Enter your email address
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
                            fontSize: '16px',
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f1f5f9',
                                fontSize: '16px',
                                '& fieldset': { border: 'none' },
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#1e293b',
                            color: 'white',
                            height: '52px',
                            fontSize: '16px',
                            fontWeight: 500,
                            textTransform: 'none',
                            borderRadius: 1,
                            mb: 2,
                            '&:hover': {
                                backgroundColor: '#334155'
                            }
                        }}
                    >
                        Send Reset Link
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: '#64748b', fontSize: '16px' }}>
                            Remember your password?{' '}
                            <Typography
                                component="a"
                                sx={{
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    fontSize: '16px'
                                }}
                            >
                               <Link to="/signin" style={{ color: '#3b82f6', textDecoration: 'none' }}> Sign in</Link>
                            </Typography>
                        </Typography>
                    </Box>
                </form>
            )}
        </AuthFormContainer>
    );

    return (
        <AuthLayout
            leftContent={leftContent}
            rightContent={rightContent}
            backgroundImage="/images/forgetpassword-bg.png"
        />
    );
};

export default ForgetPassword;
