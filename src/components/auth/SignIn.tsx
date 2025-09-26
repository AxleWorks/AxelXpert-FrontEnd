import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Link,
    Grid,
    Paper
} from '@mui/material';
import useAuth from '../../hooks/useAuth';

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

    return (
        <Box sx={{ 
            height: '100vh', 
            width: '100vw',
            margin: 0, 
            padding: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'auto'
        }}>
            <Grid container sx={{ height: '100%', margin: 0, width: '100%' }}>
                {/* Left side - Image */}
                <Grid item xs={12} md={6} sx={{ padding: 0, margin: 0 }}>
                    <Box
                        sx={{
                            backgroundImage: 'url(/images/signin-bg.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 4,
                            color: 'white',
                            position: 'relative',
                            textAlign: 'center',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                zIndex: 1,
                            }
                        }}
                    >
                        <Box sx={{ 
                            position: 'relative', 
                            zIndex: 2, 
                            width: '70%', // Changed to 70% width
                            textAlign: 'center'
                        }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    fontSize: { xs: '4rem', md: '6rem', lg: '7rem' }, // Much larger font
                                    textAlign: 'center',
                                    lineHeight: 1.1,
                                    width: '100%'
                                }}
                            >
                                <span style={{ color: '#3b82f6' }}>Axle</span>Xpert
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold', // Changed from 300 to bold
                                    fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' }, // Larger size
                                    textAlign: 'center'
                                }}
                            >
                                Your Car, Our Expertise.
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Right side - Form */}
                <Grid item xs={12} md={6} sx={{ padding: 0 }}>
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4,
                            backgroundColor: '#f8fafc'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                padding: 4,
                                width: '100%',
                                maxWidth: 400,
                                backgroundColor: 'white',
                                borderRadius: 2
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 600,
                                    mb: 4,
                                    textAlign: 'center',
                                    color: '#1e293b'
                                }}
                            >
                                Sign In
                            </Typography>

                            {error && (
                                <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            )}

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
                                        mb: 3,
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
                                        href="#"
                                        sx={{
                                            color: '#3b82f6',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            fontFamily: 'inherit', // Use same font as rest of the form
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Forgot Password?
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
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        borderRadius: 1,
                                        mb: 3,
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
                                            href="#"
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
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SignIn;