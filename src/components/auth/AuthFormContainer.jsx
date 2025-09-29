import React from 'react';
import { Paper, Typography } from '@mui/material';

const AuthFormContainer = ({ title, error, children }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                padding: 3,
                width: '100%',
                maxWidth: 380,
                backgroundColor: 'white',
                borderRadius: 2
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    mb: 3,
                    textAlign: 'center',
                    color: '#1e293b',
                    fontSize: { xs: '1.8rem', md: '2rem' }
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
