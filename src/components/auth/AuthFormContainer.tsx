import React from 'react';
import { Paper, Typography } from '@mui/material';

interface AuthFormContainerProps {
    title: string;
    error?: string | null;
    children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ title, error, children }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                padding: 3, // Reduced from 4 to 3
                width: '100%',
                maxWidth: 380, // Reduced from 400 to 380
                backgroundColor: 'white',
                borderRadius: 2
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    mb: 3, // Reduced from 4 to 3
                    textAlign: 'center',
                    color: '#1e293b',
                    fontSize: { xs: '1.8rem', md: '2rem' } // Slightly smaller font
                }}
            >
                {title}
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 1.5, textAlign: 'center', fontSize: '0.9rem' }}>
                    {error}
                </Typography>
            )}

            {children}
        </Paper>
    );
};

export default AuthFormContainer;